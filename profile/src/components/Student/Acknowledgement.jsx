import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image,
  pdf,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

import dtulogo from "../../assets/logoDtu.png";
import ArimoFont from "../../assets/Arimo.ttf"; // Import the font file

Font.register({
  family: 'Arimo',
  src: ArimoFont, // Register the font
});

const Acknowledgement = () => {
  const { studentName, RollNo } = useSelector((state) => state.auth.user);
  const [pdfData, setPdfData] = useState(null);

  const handleAcknowledgement = async () => {
    try {
      const response = await axios.post(
        "http://eceportal.dtu.ac.in:3001/ece/student/getacknowledgement",
        { rollNo: RollNo },
        { withCredentials: true }
      );

      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      // Generate PDF content
      const { presentTables, absentTables } = response.data;
      const pdfContent = (
        <Document>
          <Page style={styles.page}>
            <View>
              <View style={styles}>
                <Image src={dtulogo} style={styles.logo} />
              </View>
              <View>
                <Text style={styles.DTU}>Delhi Technological University</Text>
                <Text style={styles.headOther}>
                  Formerly Delhi College of Engineering
                </Text>

                <Text style={styles.headOther}>Acknowledgement Slip</Text>
                <Text style={styles.headOther}>
                  Department of Electronics & Communication Engineering
                </Text>
              </View>
              <View style={styles.line}></View>
              <Text style={{ ...styles.details, marginTop: 30 }}>
                Student Roll No : {RollNo}{" "}
              </Text>
              <Text style={{ ...styles.details, marginBottom: 30 }}>
                Student Name : {studentName}
              </Text>

              <View style={styles.tableContainer}>
                <View style={styles.column}>
                  <Text style={styles.header}>Details Filled</Text>
                  {presentTables.map((table) => (
                    <Text key={table} style={styles.tableText}>
                      {table}
                    </Text>
                  ))}
                </View>
                <View style={{...styles.column,borderRightWidth: 0}}>
                  <Text style={styles.header}>Details Not Filled</Text>
                  {absentTables.map((table) => (
                    <Text key={table} style={styles.tableText}>
                      {table}
                    </Text>
                  ))}
                </View>
              </View>
            <Text style={{...styles.declaration, fontFamily: 'Arimo' }}>Declaration: </Text>
              <Text style={{...styles.declaration,marginTop:5}}>
              I hereby declare that all the information I have provided 
              during the completion of the information collection process is true,
               accurate, and to the best of my knowledge. I understand that any false 
               or misleading information provided may result in disciplinary action as 
               per the university's policies.
              </Text>

              <Text style={{...styles.details, marginTop:30}}>Signature of Student ......................... </Text>
              <Text style={{...styles.details, marginBottom:20}}>Date: {formattedDateTime}</Text>

              <Text style={styles.cert}>CERTIFICATE</Text>
              <Text style={styles.certBody}>This is to certify that {studentName} ({RollNo}) has successfully fulfilled the requirements of the information filling process.</Text>  
            
            <View style={styles.signature}>
                <Text style={styles.signDate}>Dated</Text>
                <Text style={styles.sign}>Signature of Coordinator</Text>       
            </View>

            <View>
            <Text style={{...styles.sign, marginLeft:417}}>( Sumit Khandelwal )</Text>
            </View>
            
            </View>
          </Page>
        </Document>
      );

    // Create PDF Blob
    const pdfBlob = await pdf(pdfContent).toBlob();

    // Create Blob URL
    const url = URL.createObjectURL(pdfBlob);

    // Detect device type
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      //trigger direct download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "acknowledgement.pdf");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    
    if(!isMobileDevice) {
      // For laptops and desktops, set PDF data state
      setPdfData(pdfContent);
    }

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
  };

  return (
    <>
      <button
        onClick={handleAcknowledgement}
        className="font1 rounded-lg text-white font-xl bg-green-600 p-3 hover:bg-green-500 hover:scale-[104%] transition-transform ease-in"
      >
        Acknowledgement
      </button>
      <br />
      {pdfData && (
        <PDFViewer style={{ width: "90%", height: "800px" }}>
          {pdfData}
        </PDFViewer>
      )}
    </>
  );
};

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 20,
  },

  logo: {
    width: 100,
    height: 100,
    marginLeft: 30,
  },
  DTU: {
    fontSize: 20,
    textAlign: "center",
    marginLeft: 30,
    marginTop: -80,
    width: "100%",
    fontFamily: 'Arimo', 
  },
  headOther: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 20,
    textAlign: "center",
    width: "100%",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginTop: 12, // Adjust this value as needed for spacing
  },
  details: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 10,
    width: "100%",
    fontFamily: 'Arimo',
  },
  tableContainer: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    width: "90%",
    marginLeft:30,
  },
  column: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "black",   
  },
  header: {
    fontSize: 12,
    padding:5,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 10,
    fontFamily: 'Arimo',
  },
  tableText: {
    fontSize: 12,
    marginBottom: 10,
    
  },
    declaration: {
    marginTop: 20,
    fontSize: 12,
    paddingRight:15,
    marginLeft: 10,
  },
    cert:{
        marginBottom:10,
        fontSize: 12,
        textAlign: "center",
        width: "100%",
        fontFamily: 'Arimo',
    },
    certBody:{
        marginTop: 5,
        fontSize: 12,
        paddingRight:10,
        marginLeft: 10,
    },
    signature:{
        display: "flex",
        flexDirection: "row",
        marginTop:30,
    },
    signDate:{
        fontSize: 12,
        paddingRight:10,
        marginLeft: 10,
        fontFamily: 'Arimo',
    },
    sign:{
        fontSize: 12,
        marginLeft: 350,
        fontFamily: 'Arimo',
    }
});

export default Acknowledgement;
