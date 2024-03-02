/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import "./Subscribe.scss";
import BackgroundAsideType from "../../components/BackgroundAsideType/BackgroundAsideType";
import FormLabel from "../../components/FormLabel/FormLabel";

export default function Subscribe() {
  const validationSchema = Joi.object({
    lastName: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Votre nom est requis",
      "string.min": "Le nom doit contenir au moins {#limit} caractères",
      "string.max": "Le nom ne doit pas dépasser {#limit} caractères",
    }),
    firstName: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Votre prénom est requis",
      "string.min": "Le prénom doit contenir au moins {#limit} caractères",
      "string.max": "Le prénom ne doit pas dépasser {#limit} caractères",
    }),
    image: Joi.any(),
    email: Joi.string().email({ tlds: false }).max(255).required().messages({
      "string.empty": "Votre email est requis",
      "string.email": "L'email doit être valide",
      "string.max": "L'email ne doit pas dépasser {#limit} caractères",
    }),
    gender: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Le genre est requis",
    }),
    birthdate: Joi.string().min(1).max(255).required().messages({
      "string.empty": "La date de naissance est requise",
    }),
    zipcode: Joi.string()
      .pattern(/^\d{5}$/)
      .required()
      .messages({
        "string.empty": "Le code postal est requis",
        "string.pattern.base":
          "Le code postal doit contenir exactement 5 chiffres",
      }),
    city: Joi.string().min(1).max(255).required().messages({
      "string.empty": "La ville est requise",
    }),
    password: Joi.string().min(5).max(255).required().messages({
      "string.empty": "Le mot de passe est requis",
      "string.min":
        "Le mot de passe doit contenir au moins {#limit} caractères",
    }),
    confirmPassword: Joi.string()
      .min(5)
      .max(255)
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "string.empty": "La confirmation du mot de passe est requise",
        "string.min":
          "La confirmation du mot de passe doit contenir au moins {#limit} caractères",
        "any.only":
          "La confirmation du mot de passe doit correspondre au mot de passe",
      }),
  }).required();

  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: joiResolver(validationSchema) });

  const onSubmit = async (data) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      toast.success("Enregistrement validé", {
        onClose: () => {
          setTimeout(() => {
            navigate("/connection");
          }, 2500);
        },
      });
    } else {
      toast.error("Erreur d'enregistrement, veuillez réessayer");
    }
  };

  return (
    <BackgroundAsideType title="S'enregistrer">
      <form className="subscribeForm" onSubmit={handleSubmit(onSubmit)}>
        <FormLabel
          label="lastName"
          labelTitle="Nom"
          register={register}
          errors={errors}
          placeholder="Tapez votre nom ici"
        />
        <FormLabel
          label="firstName"
          labelTitle="Prénom"
          register={register}
          errors={errors}
          placeholder="Tapez votre prénom ici"
        />
        <FormLabel
          label="pictureProfil"
          labelTitle="Photo de Profil"
          register={register}
          errors={errors}
        />
        <FormLabel
          label="email"
          labelTitle="Email"
          register={register}
          errors={errors}
          placeholder="Tapez votre email ici"
        />
        <FormLabel
          label="gender"
          labelTitle="Genre"
          register={register}
          errors={errors}
        />
        <FormLabel
          label="birthdate"
          labelTitle="Date de naissance"
          register={register}
          errors={errors}
        />
        <FormLabel
          label="zipcode"
          labelTitle="Code Postal"
          register={register}
          errors={errors}
          placeholder="Tapez votre code postal ici"
        />
        <FormLabel
          label="city"
          labelTitle="Ville"
          register={register}
          errors={errors}
          placeholder="Tapez votre ville ici"
        />
        <FormLabel
          label="password"
          labelTitle="Mot de passe"
          register={register}
          errors={errors}
          placeholder="Tapez votre mot de passe ici"
        />
        <FormLabel
          label="confirmPassword"
          labelTitle="Confirmer le mot de passe"
          register={register}
          errors={errors}
          placeholder="Retapez votre mot de passe ici"
        />
        <button className="submit" type="submit">
          Envoyer
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
    </BackgroundAsideType>
  );
}
