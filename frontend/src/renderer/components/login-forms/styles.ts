import { css } from 'emotion'

export const styles = {
  titleContainer: css`
    background-color: white;
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 22px;
    letter-spacing: -0.5px;
    color: black;
    text-align: center;
    border-bottom: 2px solid rgba(193, 193, 193, 0.4);
    box-shadow: 0px 1px 1px rgba(193, 193, 193, 0.2);
    padding: 15px;
  `,
  title: css`
    display: flex;
    margin: 0;
    align-items: center;
  `,
  mainContainer: css`
    margin: 25px auto;
    width: 75%;
  `,
  formItem: css`
    margin-bottom: 15px;
  `,
}
