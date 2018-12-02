import { css } from 'emotion'

export const styles = {
  searchContainer: css`
    padding: 20px;
  `,
  searchStyle: css`
    width: 50%;
    margin: 0 auto;
  `,
  avatar: css`
    margin-top: 5px;
    margin-right: 5px;
    width: 80%;
    height: 80%;
    object-fit: contain;
  `,
  container: css`
    padding: 20px;
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
