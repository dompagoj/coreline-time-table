import { snakeCase } from 'lodash'
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm'

export class CustomNamingStragegy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  public tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName)
  }
  public columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join('_'),
    )
  }

  public relationName(propertyName: string): string {
    return snakeCase(propertyName)
  }
}
