import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/AuthSlice";
import UserSlice from "./reducers/UserSlice";
import UserProfessionalSkills from "./reducers/student/UserProfessionalSkills";
import UserPersonalDetails from "./reducers/student/UserPersonalDetails";
import UserImage from "./reducers/student/UserImage";
import UserPlacement from "./reducers/student/UserPlacementDetail";
import UserMtechEducationalDetails from "./reducers/student/UserMtechEducationalDetails";
import UserEntrepreneurDetails from "./reducers/student/UserEntrepreneurDetails";
import UserHigherEducationDetails from "./reducers/student/UserHigherEducationDetails";
import UserPublicationDetails from "./reducers/student/UserPublicationDetails";
import UserInterInstituteDetails from "./reducers/student/UserInterInstituteDetails";
import UserBtechEducationalDetails from "./reducers/student/UserBtechEducationalDetails";
import FacultyImageReducer from "./reducers/student/UserFacultyImage";
import UserQualificationsReducer from "./reducers/student/UserQualification";
import UserAssociationReducer from "./reducers/student/UserAssocation";
import userResearchPapersReducer from "./reducers/student/UserResearchPaper"; // Import the UserResearchPaper reducer
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
