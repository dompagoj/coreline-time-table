import { css } from 'emotion'

export const styles = {
  container: css``,
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
  formContainer: css`
    margin: 20px;
    display: grid;
    grid-template-columns: 60% 40%;
    grid-gap: 15px;
  `,
  buttons: css`
    text-align: end;
  `,
}

//style={{ fontWeight: 'bold', letterSpacing: '-0.5px', textAlign: 'center' }}
