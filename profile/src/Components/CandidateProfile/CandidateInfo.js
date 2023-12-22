import React from 'react'

function CandidateInfo() {
  return (
    <div>
        <div className="NameSection flex">
            <ul>
                <li className='Name font-bold'>Mr Sumit Kumar Khandelwal</li>
                <li className='designation'>Assistant Professor</li>
            </ul>
        </div>
        <div className="Expertise">
            <p><span>Microwave Engineering, Advanced Semiconductor Devices</span></p>
        </div>

        <div className="personalInformation">
            <ul>
                <li className="name">Mr Sumit Kumar Khandelwal</li>
                <li className="gender">Male</li>
                <li className="collegeAdress">Delhi Technological University, Bawana Road, Shahbad Daulatpur Village, Rohini</li>
                <li className="city">Delhi, New Delhi, - 110042</li>
            </ul>
        </div>
        <div className="experince">
            <ul>
                <li>
                    <div className="yearRange">2019 - Present</div>
                    <div className="positionInfo">
                        <ul>
                            <li className='Designation'>Assistant Professor</li>
                            <li className='Organisation'>Department of Electronics and Communication Engineering Delhi Technological University</li>
                        </ul>
                    </div>
                </li>
                
            </ul>
        </div>
        <div className="Qualification">
            <ul>
                <li>
                    <div className="year">2012</div>
                    <div className='EducationInfo'>
                        <ul>
                            <li className='degree'>M.Tech</li>
                            <li className='collegeName'>CSIR-Central Electronics Engineering Research Institute</li>
                        </ul>
                    </div>
                    
                </li>
            </ul>
        </div>
    </div>
  )
}

export default CandidateInfo