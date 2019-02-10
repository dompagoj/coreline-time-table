import { css } from 'emotion'

export default {
  container: css`
    padding: 5px 20px;
    display: grid;
    grid-template-columns: 35% 65%;
    grid-gap: 25px;
  `,
  hoursTitle: css`
    font-weight: bold;
    color: gray;
    text-align: center;
    border-bottom: 1px solid gray;
  `,
}