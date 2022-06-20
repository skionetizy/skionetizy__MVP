import React from "react";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import * as yup from "yup";
import {
  getProfileDetailsAPIHandler,
  updateProfileDetails,
} from "../API/profileAPIHandler";
import useAsync from "../hooks/useAsync";
import useForm from "../hooks/useForm";
import useMutate from "../hooks/useMutate";
import clsx from "../utils/clsx";
import Button from "./Button";
import style from "./EditProfileDetails.module.css";
import { Center, Stack } from "./Layouts";

function EditProfileDetails({ onClose, profileUserName }) {
  const { data, setData, getInputProps, setErrors, errors } =
    useForm(initailData);

  const profileAsync = useAsync(
    () =>
      getProfileDetailsAPIHandler(profileUserName).then((res) => {
        setData(res.profile);
        return res.profile;
      }),
    {},
    [profileUserName]
  );

  const profileMutation = useMutate({
    mutateFn: async () => {
      const validData = await editProfileSchema.validate(data, {
        abortEarly: false,
        context: true,
      });

      const formData = new FormData();
      formData.append("profileBio", validData.profileBio);
      formData.append("profileWebsiteURL", validData.profileWebsiteURL);
      await updateProfileDetails(profileAsync.data.profileID, formData);
    },
    onSuccess: () => {
      onClose();
    },
    onFailure: (errors) => {
      setErrors(errors);
    },
  });

  return (
    <div className={style.wrapper}>
      {profileAsync.isLoading && (
        <div className={style.backdrop}>
          <FiLoader width="1em" fontSize="2rem" className="ani-spinner" />
        </div>
      )}
      <button className={style.closeBtn} onClick={onClose}>
        &times;
      </button>

      <button className={style.backBtn} onClick={onClose}>
        <FiArrowLeft width="1em" />
      </button>

      <h1 className={style.heading}>Edit Profile</h1>

      <form className={style.formSection} onSubmit={(e) => profileMutation.mutate(data, e)}>
        <Stack spacing="3rem">
          <div className={style.topSection}>
            <div className={style.nameSection}>
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={profileAsync.data.profileName}
                  style={{marginLeft: "10px"}}
                  // disabled
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                />
              </div>
            </div>
            <div>
              <label htmlFor="DateOfBirth">Date of birth</label>
              <input
                type="text"
                name="DateOfBirth"
                id="DateOfBirth"
                placeholder="DD/MM/YY"
              />
            </div>
          </div>

          <hr className={style.horizontalLine} />

          <div>
            <label htmlFor="">Website Link</label>
            <input
              className={style.url}
              {...getInputProps("profileWebsiteURL")}
            />
            <InputError error={errors.profileWebsiteURL} />
          </div>

          <div>
            <div className={style.bio}>
              <label htmlFor="Bio">Bio</label>
              <textarea id="Bio" {...getInputProps("profileBio")} rows="4" />
            </div>
            <InputError error={errors.profileBio} />
          </div>

          <Center>
            <Button className={style.saveBtn} isLoading={profileMutation.isLoading} type="submit">
              Save
            </Button>
          </Center>
        </Stack>
      </form>
    </div>
  );
}

function InputError({ className, error, ...props }) {
  return error ? (
    <p className={clsx(style.inputError, className)} {...props}>
      {error}
    </p>
  ) : null;
}

const initailData = {
  profileBio: "",
  profileWebsiteURL: "",
};

const editProfileSchema = yup.object().shape(
  {
    profileWebsiteURL: yup
      .string()
      .url("Website URL must be valid URL")
      .when("profileWebsiteURL", {
        is: (url) => !!url,
        then: yup.string().min(7, "Website URL must be 7 characters longer"),
      }),
    profileBio: yup.string().when("profileBio", {
      is: (bio) => !!bio,
      then: yup.string().min(3, "Bio must be 3 characters longer"),
    }),
  },
  [
    ["profileWebsiteURL", "profileWebsiteURL"],
    ["profileBio", "profileBio"],
  ]
);

export default EditProfileDetails;
