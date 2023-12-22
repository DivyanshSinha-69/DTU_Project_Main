import React from 'react'

function Leftbar() {
  return (
    <div>
        <div className="leftBar p-5 flex">
            <img src="https://dtu.irins.org/assets/images/men.png" alt="" />
        </div>
        <div className="belowImage p-5">
            <ul>
                <li>Profile</li>
                <li>Personal Information</li>
                <li>Expertise Information</li>
                <li>Experince</li>
                <li>Education Qualification</li>
            </ul>
        </div>
    </div>
  )
}

export default Leftbar