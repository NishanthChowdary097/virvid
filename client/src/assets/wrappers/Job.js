import styled from 'styled-components';

const Wrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: block;
  box-shadow: var(--shadow-2);
  width: 100%;
  contain: layout style paint; /* CSS containment to isolate this element */
  margin-bottom: 2rem;
  
  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  .main-icon {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    background: #d780ff;
    border-radius: var(--border-radius);
    font-size: 2rem;
    font-weight: 1000;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }

  .info {
    h5 {
      margin-bottom: 0.5rem;
      font-size: large;
    }

    p {
      margin: 0;
      text-transform: capitalize;
      font-size: larger;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }

  .content {
    padding: 1rem 1.5rem;
  }

  .content-center {
    display: grid;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    align-items: center;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .status {
    border-radius: var(--border-radius);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: center;
    width: 120px;
    height: 30px;
    display: grid;
    align-items: center;
  }


  .video-btn{
    width: 60%;
    height: 120%;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--grey-100);
  }

  .edit-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }

  .edit-btn {
    margin-right: 0.5rem;
  }

  .video-container {
    position: relative;
    width: 200%; /* Ensure the container takes the full width */
    padding-bottom: 100%; /* 16:9 aspect ratio */
    height: 100%;
    overflow: hidden;
    margin-top: 10px;
  }

  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%; /* Full width of the container */
    height: 100%; /* Full height based on aspect ratio */
    max-width: 100%; /* Ensure the video doesn't overflow horizontally */
  }

  /* When video is visible, expand content */
  .content.expanded {
    max-height: 1000px; /* Increased max-height to accommodate video and other content */
  }
`;

export default Wrapper;
