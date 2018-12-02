import { css } from 'emotion'

export const styles = {
  container: css`
    z-index: 100;
    position: absolute;
    bottom: 40px;
    right: 15px;
    height: 300px;
    width: 500px;
    background-color: #2b2b2b;
    color: white;
    overflow-y: auto;
    border: 1px solid black;
    padding: 10px;
  `,
  input: css`
    background-color: #2b2b2b;
    border: none;
    color: white;
    font-weight: bold;
    &:focus {
      outline: none;
    }
  `,
  arrow: css`
    background-color: #2b2b2b;
    margin-right: 5px;
    color: green;
  `,
}
