import { css } from 'emotion'
import { generalStateStore } from '../../stores/GeneralState'

export const styles = {
  container: css`
    min-width: 400px;
    height: 100%;
    padding: 20px;
    /* background-color: ${generalStateStore.themeMode.secondary} */
  `,
  dayContainer: css`
    padding: 10px;
    border: 1px solid black;
    margin: -1px -1px 0 0;
    &:hover {
      background-color: rgba(127, 176, 255, 0.65) !important;
      transition: 0.8s ease-out !important;
      cursor: pointer !important;
    }
  `,
  disabledDayContainer: css`
    padding: 10px;
    border: 1px solid black;
    margin: -1px -1px 0 0;
    background-color: darkgray;
  `,

  dayContent: css`
    padding: 0 5px 0 0;
    text-align: end;
    overflow-y: auto;
  `,

  header: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    justify-items: center;
  `,
  day: css`
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
  `,
  content: css`
    padding: 5px 0;
    border-bottom: 3px solid lightgreen;
  `,
  today: css`
    display: flex;
    padding: 3px 15px;
    justify-content: center;
    color: white;
    width: 25%;
    margin-left: auto;
    font-weight: bold;
    font-size: 17px;
    background-color: red;
    border-radius: 25px;
    margin-bottom: 5px;
  `,
  rowContainer,
}

function rowContainer(days) {
  const rows = Math.ceil(days / 7)

  return css`
    display: grid;
    height: calc(100% - 53px);
    width: 100%;
    grid-template: repeat(${rows}, 1fr) / repeat(7, 1fr);
  `
}
