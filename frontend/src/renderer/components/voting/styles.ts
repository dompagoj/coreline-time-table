import { css } from 'emotion'

export const styles = {
  title: css`
    font-weight: bold;
    font-size: 22px;
    letter-spacing: -0.5px;
    color: black;
    text-align: center;
    border-bottom: 2px solid rgba(193, 193, 193, 0.4);
    box-shadow: 0px 1px 1px rgba(193, 193, 193, 0.2);
    padding: 15px;
  `,
  container: css`
    margin: 20px;
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 15px;
  `,
}
