import { toast } from 'react-toastify';
import { JobsContainer } from '../components';
import customFetch from '../components/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext, useState, useEffect } from 'react';

export const loader = async({request}) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries()
  ]);
  try {
    const {data} = await customFetch.get('/jobs',{
      params,
    })
    return {data, searchValues:{...params}}
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const AllJobsContext = createContext()

const AllJobs = () => {
  const {data, searchValues} = useLoaderData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredJobs, setFilteredJobs] = useState(data.jobs)
  const [teacherNames, setTeacherNames] = useState({})

  // Fetch teacher names for all jobs
  useEffect(() => {
    const fetchTeacherNames = async () => {
      const names = {}
      for (const job of data.jobs) {
        if (job.createdBy && !names[job.createdBy]) {
          try {
            const response = await customFetch.get(`/getTeacher/getTeacher/${job.createdBy}`)
            names[job.createdBy] = response.data.name.toLowerCase()
          } catch (error) {
            console.error('Error fetching teacher name:', error)
            names[job.createdBy] = ''
          }
        }
      }
      setTeacherNames(names)
    }

    fetchTeacherNames()
  }, [data.jobs])

  // Filter jobs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredJobs(data.jobs)
    } else {
      const filtered = data.jobs.filter(job => {
        const term = searchTerm.toLowerCase()
        const topicMatch = job.topicName?.toLowerCase().includes(term)
        const subjectMatch = job.subjectName?.toLowerCase().includes(term)
        const teacherMatch = teacherNames[job.createdBy]?.includes(term)
        
        return topicMatch || subjectMatch || teacherMatch
      })
      setFilteredJobs(filtered)
    }
  }, [searchTerm, data.jobs, teacherNames])

  const contextValue = {
    data: { ...data, jobs: filteredJobs },
    searchValues
  }

  return (
    <AllJobsContext.Provider value={contextValue}>
      <div style={{ 
        marginBottom: '2rem', 
        padding: '0 2rem',
        maxWidth: '1200px',
        margin: '0 auto 2rem auto'
      }}>
        <input
          type="text"
          placeholder="Search by topic, subject, or teacher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '25px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ae00ff'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0'
          }}
        />
        {searchTerm && (
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            Found {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''} for "{searchTerm}"
          </div>
        )}
      </div>
      <JobsContainer />
    </AllJobsContext.Provider>
  )
}
export const useAllJobsContext = () => useContext(AllJobsContext)

export default AllJobs

