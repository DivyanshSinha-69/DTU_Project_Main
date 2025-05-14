import React, { useEffect, useState } from "react";
import axios from "axios";

const monthOptions = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (i + 1));
  return {
    label: date.toLocaleString("default", { month: "long", year: "numeric" }),
    value: i + 1, // months_ago = 1 (last month) to 6
  };
});

const ResearchDigestPage = () => {
  const dummyResearchData = {
    1: [
      // Last month's data
      {
        faculty_id: "F1001",
        paper_type: "Journal Article",
        title_of_paper: "Advancements in Quantum Machine Learning",
        area_of_research: "Quantum Computing, Machine Learning",
        published_year: 2023,
        month: 11, // November
        authors: "Dr. Smith, Dr. Johnson, Dr. Lee",
        name_of_publication: "Journal of Quantum Computing",
        ISSN_number: "1234-5678",
      },
      {
        faculty_id: "F1002",
        paper_type: "Conference Paper",
        title_of_paper: "Neural Networks for Climate Prediction",
        area_of_research: "Artificial Intelligence, Climate Science",
        published_year: 2023,
        month: 11,
        authors: "Dr. Brown, Dr. Davis, Dr. Miller",
        name_of_publication: "International AI Conference Proceedings",
        ISSN_number: "2345-6789",
      },
    ],
    2: [
      // Two months ago
      {
        faculty_id: "F1003",
        paper_type: "Review Article",
        title_of_paper: "Recent Developments in Nanomedicine",
        area_of_research: "Nanotechnology, Medicine",
        published_year: 2023,
        month: 10,
        authors: "Dr. Wilson, Dr. Taylor",
        name_of_publication: "Nanotechnology Reviews",
        ISSN_number: "3456-7890",
      },
    ],
    3: [
      // Three months ago
      {
        faculty_id: "F1004",
        paper_type: "Journal Article",
        title_of_paper: "Blockchain Applications in Healthcare",
        area_of_research: "Blockchain, Healthcare IT",
        published_year: 2023,
        month: 9,
        authors: "Dr. Anderson, Dr. Thomas, Dr. Jackson",
        name_of_publication: "Healthcare Technology Journal",
        ISSN_number: "4567-8901",
      },
      {
        faculty_id: "F1005",
        paper_type: "Conference Paper",
        title_of_paper: "Sustainable Urban Development Models",
        area_of_research: "Urban Planning, Sustainability",
        published_year: 2023,
        month: 9,
        authors: "Dr. White, Dr. Harris",
        name_of_publication: "International Urban Development Conference",
        ISSN_number: "5678-9012",
      },
    ],
    4: [], // Four months ago - empty array for testing "no research" case
    5: [
      // Five months ago
      {
        faculty_id: "F1006",
        paper_type: "Journal Article",
        title_of_paper: "Advances in CRISPR Gene Editing",
        area_of_research: "Genetics, Biotechnology",
        published_year: 2023,
        month: 7,
        authors: "Dr. Martin, Dr. Garcia, Dr. Rodriguez",
        name_of_publication: "Journal of Genetic Engineering",
        ISSN_number: "6789-0123",
      },
    ],
    6: [
      // Six months ago
      {
        faculty_id: "F1007",
        paper_type: "Book Chapter",
        title_of_paper: "The Future of Renewable Energy",
        area_of_research: "Energy, Sustainability",
        published_year: 2023,
        month: 6,
        authors: "Dr. Martinez, Dr. Robinson",
        name_of_publication: "Advances in Sustainable Technologies",
        ISSN_number: "7890-1234",
      },
      {
        faculty_id: "F1008",
        paper_type: "Journal Article",
        title_of_paper: "Machine Learning in Financial Fraud Detection",
        area_of_research: "Finance, Machine Learning",
        published_year: 2023,
        month: 6,
        authors: "Dr. Clark, Dr. Lewis, Dr. Walker",
        name_of_publication: "Journal of Financial Technology",
        ISSN_number: "8901-2345",
      },
      {
        faculty_id: "F1009",
        paper_type: "Conference Paper",
        title_of_paper: "Virtual Reality in Education",
        area_of_research: "Education Technology, VR",
        published_year: 2023,
        month: 6,
        authors: "Dr. Hall, Dr. Allen",
        name_of_publication: "EdTech International Conference",
        ISSN_number: "9012-3456",
      },
    ],
  };
  const [selectedMonth, setSelectedMonth] = useState(1); // Default to last month
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDigest = async (monthsAgo) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResearchPapers(dummyResearchData[monthsAgo] || []);
    } catch (error) {
      console.error("Failed to fetch digest:", error);
      setResearchPapers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDigest(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="bg-[#111] text-white min-h-screen pb-10">
      {/* Top animated digest banner */}

      {/* Month Selector */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Monthly Research Digest
        </h2>
        <div className="flex justify-center mb-8">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Digest Papers */}
        {loading ? (
          <div className="text-center text-yellow-400">Loading...</div>
        ) : researchPapers.length === 0 ? (
          <div className="text-center text-gray-400">
            No research found for this month.
          </div>
        ) : (
          <div className="space-y-6">
            {researchPapers.map((paper, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-yellow-300 mb-1">
                  {paper.title_of_paper}
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Authors:</strong> {paper.authors}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  <strong>Area:</strong> {paper.area_of_research}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  <strong>Published In:</strong> {paper.name_of_publication}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Type:</strong> {paper.paper_type} |{" "}
                  <strong>ISSN:</strong> {paper.ISSN_number}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDigestPage;
