import styled from 'styled-components'

export const StyledLoginBox = styled.div`
  min-height: 95vh;
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

export const StyledLoginCard = styled.div`
  padding: 32px;
  width: 380px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  @media (max-width: 768px) {
    width: 90vw;
    padding: 24px;
    border-radius: 16px;
  }
  @media (max-width: 480px) {
    width: 98vw;
    padding: 12px;
    border-radius: 8px;
  }
`

export const StyledTitle = styled.h2`
  margin-bottom: 24px;
  text-align: center;
  color: #2575fc;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
  font-size: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`
