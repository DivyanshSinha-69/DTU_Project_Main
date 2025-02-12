import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/AuthSlice";
import UserSlice from "./reducers/UserSlice";
import UserProfessionalSkills from "./reducers/UserProfessionalSkills";
import UserPersonalDetails from "./reducers/UserPersonalDetails";
import UserImage from "./reducers/UserImage";
import UserPlacement from "./reducers/UserPlacementDetail";
import UserMtechEducationalDetails from "./reducers/UserMtechEducationalDetails";
import UserEntrepreneurDetails from "./reducers/UserEntrepreneurDetails";
import UserHigherEducationDetails from "./reducers/UserHigherEducationDetails";
import UserPublicationDetails from "./reducers/UserPublicationDetails";
import UserInterInstituteDetails from "./reducers/UserInterInstituteDetails";
import UserBtechEducationalDetails from "./reducers/UserBtechEducationalDetails";
import FacultyImageReducer from "./reducers/UserFacultyImage";
import UserQualificationsReducer from "./reducers/UserQualification";
import UserAssociationReducer from "./reducers/UserAssocation";
import userResearchPapersReducer from "./reducers/UserResearchPaper"; // Import the UserResearchPaper reducer
import userVAErecordsReducer from "./reducers/UserVAErecords"; // Import the VAErecords slice

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: UserSlice,
    userImage: UserImage,
    professionalSkills: UserProfessionalSkills,
    personalDetails: UserPersonalDetails,
    placement: UserPlacement,
    mtechEducation: UserMtechEducationalDetails,
    btechEducation: UserBtechEducationalDetails,
    entrepreneurDetails: UserEntrepreneurDetails,
    higherEducationDetails: UserHigherEducationDetails,
    publicationDetails: UserPublicationDetails,
    interInstitute: UserInterInstituteDetails,
    facultyImage: FacultyImageReducer,
    userQualifications: UserQualificationsReducer,
    userAssociation: UserAssociationReducer,
    userResearchPapers: userResearchPapersReducer, // Add the research papers reducer here
    userVAErecords: userVAErecordsReducer,
  },
});

// export const store;
