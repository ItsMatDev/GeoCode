const { format } = require("date-fns");
const AbstractManager = require("./AbstractManager");
const generateTimeSlots = require("../services/generateTimeSlots");

class BookManager extends AbstractManager {
  constructor() {
    super({ table: "booking_list" });
  }

  async create(formattedDate, selectedVehicle, selectedStation) {
    try {
      const [result] = await this.database.query(
        `INSERT INTO booking_list (date, charge_point_id, car_id)
        SELECT ?, cp.charge_point_id_fr, ?
        FROM charge_point AS cp
        LEFT JOIN booking_list AS bl
        ON cp.charge_point_id_fr = bl.charge_point_id
        AND bl.date = ?
        WHERE cp.station_id = ?
        AND bl.charge_point_id IS NULL
        LIMIT 1;`,
        [formattedDate, selectedVehicle, formattedDate, selectedStation]
      );

      if (result && result.affectedRows > 0) {
        return result;
      }
      throw new Error("Échec de la réservation.");
    } catch (error) {
      return console.error(error);
    }
  }

  async getAll() {
    const [rows] = await this.database
      .query(`SELECT date, charge_point_id, car_id
    FROM ${this.table} `);

    return rows;
  }

  async getBookingForUser(id) {
    const [rows] = await this.database.query(
      `SELECT bl.id as bookId, bl.date, bl.car_id, car.*, user.*, cp.*, station.*, lpt.*, pt.*
      FROM ${this.table} as bl
      INNER JOIN car ON car.id = bl.car_id 
      INNER JOIN user ON car.user_id = user.id 
      INNER JOIN charge_point as cp ON cp.charge_point_id_fr = bl.charge_point_id
      INNER JOIN station ON cp.station_id = station.station_id_fr
      INNER JOIN list_plug_type as lpt ON lpt.charge_point_id = cp.charge_point_id_fr
      INNER JOIN plug_type as pt ON pt.id = lpt.plug_type_id
      WHERE user.id = ?
      ORDER BY bl.date ASC;`,
      [id]
    );
    return rows;
  }

  async delete(bookId) {
    const [result] = await this.database.query(
      `delete from ${this.table} WHERE id = (?)`,
      [bookId]
    );
    return result;
  }

  async getNotBookedDateByStationId(stationId, date) {
    const dateArray = generateTimeSlots(date);
    const dateAvailableArray = [];

    await Promise.all(
      dateArray.map(async (d) => {
        const formattedDate = format(d, "yyyy-MM-dd HH:mm:ss", {
          timeZone: "Europe/Paris",
        });

        try {
          const [result] = await this.database.query(
            `SELECT ((SELECT COUNT(charge_point_id_fr) 
            FROM charge_point
            WHERE station_id = ?) - (SELECT COUNT(charge_point_id_fr)
            FROM booking_list
            INNER JOIN charge_point 
            ON charge_point_id_fr = charge_point_id
            WHERE station_id = ?
            AND date = ?)) AS result;`,
            [stationId, stationId, formattedDate]
          );

          if (result[0].result) {
            dateAvailableArray.push(formattedDate);
          }
        } catch (error) {
          return console.error(error);
        }
        return null;
      })
    );

    dateAvailableArray.sort((a, b) => new Date(a) - new Date(b));

    return dateAvailableArray;
  }
}
module.exports = BookManager;
