import { css } from 'emotion'

export const styles = {
  container: css`
    min-width: 400px;
    height: 90%;
  `,

  rowContainer: css`
    display: grid;
    height: 100%;
    grid: auto-flow / repeat(7, 1fr);
  `,

  dayContainer: css`
    padding: 10px;
    border: 1px solid black;
    margin: -1px -1px 0 0;
    &:hover {
      background-color: rgba(127, 176, 255, 0.65);
      transition: 0.8s ease-out;
    }
  `,
  disabledDayContainer: css`
    padding: 10px;
    border: 1px solid black;
    margin: -1px -1px 0 0;
    background-color: lightgray;
  `,

  dayContent: css`
    padding: 0 5px 0 0;
    text-align: end;
  `,

  header: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
  `,
  day: css`
    font-weight: 1000;
    font-size: 20px;
  `,
  content: css`
    border-bottom: 3px solid lightgreen;
  `,
}
