import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../DashBoard/Dashboard'
import Navbar from '../Navbar/Navbar'
import AddCompanyForm from '../Company/AddCompany'
import AddJobPage from '../Jobs/AddJobs/AddJobPage'
// import { SearchResults } from '../Search_Results/SearchResults'
import JobView from '../Jobs/ViewJobs/JobView'
import MainApply from '../Jobs/ApplyJobs/MainApply'
import Success from '../Jobs/ApplyJobs/Sucess/Sucess'
import ViewProfile from '../Profile/Profile'
import ViewCompany from '../Company/ViewCompany'
import EditCompanyForm from '../Company/EditCompany'
import EditJobPage from '../Jobs/Editjob/EditJobPage'
import Resume from '../Resume/Resume'
import Application from '../Jobs/Applications/Applications'


const Home = () => {
  const role = localStorage.getItem('role');

  return (
    <div className="App">
      <Navbar className='navbar' />
      <Routes>
        <Route path="/" element={role==='emp'?<Dashboard />:<JobView/>} />
        <Route path="/jobpage/:jobid" element={<JobView />} />
        <Route path="/jobpage/*" element={<JobView />} />
        
        <Route path="/apply/:jobID" element={<MainApply />} />
        <Route path="/addcompany/*" element={<AddCompanyForm />} />
        <Route path="/viewcompany/:companyId" element={<ViewCompany />} />
        <Route path="/viewcompany/*" element={<ViewCompany />} />
        <Route path="/editcompany/:companyId" element={<EditCompanyForm />} />
        <Route path="/addjob/*" element={<AddJobPage />} />
        
        <Route path="/editjob/:id" element={<EditJobPage />} />
        <Route path="/applications/:jobid" element={<Application />} />
        <Route path="/viewprofile/*" element={<ViewProfile />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </div>
  )
}

export default Home