import { css } from 'emotion'

export const styles = {
  headerContainer: css`
    padding: 10px;
  `,
  extraContent: css`
    display: grid;
    grid-template-columns: 60% 40%;
    grid-gap: 25px;
  `,
  tableContainer: css`
    /* padding: 25px; */
  `,
  actionsContainer: css`
    display: flex;
    justify-content: flex-end;
    .tab-button {
      margin: 0 2px;
    }
  `
}
