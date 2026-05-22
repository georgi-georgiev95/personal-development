import { styled } from '@linaria/react'

export const OptimusContainer = styled.div`
  position: relative;
  width: 100%;
  height: 420px;
  background: transparent;

  .three-mount {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    right: 16px;
    bottom: 16px;
    display: flex;
    gap: 8px;
  }

  button {
    padding: 8px 12px;
    border-radius: 6px;
    border: 0;
    background: #111827;
    color: #fff;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  .speed-control {
    position: absolute;
    left: 16px;
    bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(17, 24, 39, 0.75);
    backdrop-filter: blur(6px);
    padding: 6px 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  input[type='range'] {
    width: 100px;
    accent-color: #6c63ff;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    height: 320px;
    .controls {
      right: 8px;
      bottom: 8px;
      flex-direction: column;
    }
    button {
      padding: 6px 10px;
      font-size: 14px;
    }
  }
`

export default OptimusContainer
