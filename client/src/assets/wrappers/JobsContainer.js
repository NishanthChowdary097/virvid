import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 4rem;
  margin-bottom: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .jobs {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  .jobs > * {
    flex: none; /* Prevent flex items from stretching */
  }
  @media (min-width: 1120px) {
    .jobs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      grid-auto-rows: max-content; /* Each row takes only the height it needs */
    }
  }
`;
export default Wrapper;
