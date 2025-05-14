import DTUGlance from "./DTUGlance";
import KnowYourAlumni from "./KnowYourAlumni";
import MeetYourMentors from "./KnowYourMentors";
import LandingPage from "./LandingPage";
import ResearchDigest from "./ResearchDigest.jsx";

const Home = () => {
  return (
    <>
      <LandingPage />
      <DTUGlance />
      <MeetYourMentors />
      <ResearchDigest />
      <KnowYourAlumni />
    </>
  );
};

export default Home;
