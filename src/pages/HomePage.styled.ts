import styled from 'styled-components'

export const StyledHomeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 95vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  position: relative;
  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 90vh;
  }
  @media (max-width: 480px) {
    padding: 1rem;
    min-height: 85vh;
  }
`
