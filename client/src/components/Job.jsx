import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';
import { Form, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customFetch from '../components/customFetch';

day.extend(advancedFormat);

const Job = ({
  _id,
  text,
  topicName,
  subjectName,
  video,
  createdAt,
  verified,
  createdBy,
  standard,
  file,
  userData
}) => {
  const [userName, setUserName] = useState('');
  const [isQuizSolved, setIsQuizSolved] = useState(false);
  const navigate = useNavigate();

  const date = day(createdAt).format('MMM DD, YYYY');
  const userRole = userData?.role;

  const handleJobClick = () => {
    navigate(`/dashboard/job-detail/${_id}`);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await customFetch.get(`/getTeacher/getTeacher/${createdBy}`);
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching teacher name:', error);
      }
    };
    fetchUserName();
  }, [createdBy]);

  useEffect(() => {
    // Only calculate quiz status for user role
    if (userRole === 'user') {
      const solvedArray = userData?.solved || [];
      // Only consider quiz solved if user has achieved perfect score (5/5)
      const solved = solvedArray.some(entry =>
        (entry.contentId === _id || entry.contentId?._id === _id) && entry.score === 5
      );
      setIsQuizSolved(solved);
    }
  }, [userData, _id, userRole]);

  return (
    <Wrapper 
      className="job-card"
    >
      <div onClick={handleJobClick}>
        <header>
          <div className="main-icon">{standard}</div>
          <div className="info" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
          }}>
            <h5 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>{topicName}</h5>
            <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '600' }}>{subjectName}</p>
          </div>
        </header>

        <div className="content">
          <div className="content-center">
            <JobInfo icon={<FaCalendarAlt />} text={date} />
            <JobInfo icon={<FaUserGraduate />} text={userName} />
            
            <button 
              className="btn" 
              onClick={handleJobClick}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginTop: '1rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              View Material
            </button>
            
            {/* Show quiz status for user role, delete button for admin/legend */}
            {userRole === 'user' ? (
              <div style={{ 
                textAlign: 'center',
                marginTop: '0.5rem',
                width: '75%',
                margin: '0.5rem auto 0 auto'
              }}>
                {isQuizSolved ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'green', 
                    fontWeight: 'bold',
                    padding: '0.5rem',
                    backgroundColor: '#d4edda',
                    borderRadius: '4px',
                    border: '1px solid #c3e6cb',
                    width: '100%'
                  }}>
                    ✓ Quiz Completed
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#856404', 
                    fontWeight: 'bold',
                    padding: '0.5rem',
                    backgroundColor: '#fff3cd',
                    borderRadius: '4px',
                    border: '1px solid #ffeaa7',
                    width: '100%'
                  }}>
                    Quiz Pending
                  </div>
                )}
              </div>
            ) : userData && userRole !== 'user' && (
              <div style={{ 
                textAlign: 'center',
                marginTop: '0.5rem',
                width: '75%',
                margin: '0.5rem auto 0 auto'
              }} onClick={(e) => e.stopPropagation()}>
                <Form method="post" action={`../delete-job/${_id}`}>
                  <button type="submit" className="btn" style={{
                    width: '100%', 
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginTop: '0.5rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    Delete
                  </button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Job;
