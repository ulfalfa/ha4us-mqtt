export class Matcher {

  private _regexp: RegExp
  private _topic: string
  private _pattern: string
  /**
   * Multiplies a value by 2. (Also a full example of Typedoc's functionality.)
   *
   * ### Example (es module)
   * ```js
   * import { double } from 'typescript-starter'
   * console.log(double(4))
   * // => 8
   * ```
   *
   * ### Example (commonjs)
   * ```js
   * var double = require('typescript-starter').double;
   * console.log(double(4))
   * // => 8
   * ```
   *
   * @param aTopicPattern a topic containing # and +.
   */
  constructor (aTopicPattern: string) {
    this._regexp = new RegExp('^' +
         aTopicPattern.replace(/\+/g, '([^\/]*)').replace(/#/g, '(.*?)') + '$')
    this._pattern = aTopicPattern

    let hashPos = aTopicPattern.indexOf('#')
    if (hashPos > -1) {
      this._topic = aTopicPattern.substring(0, hashPos + 1)
    } else {
      this._topic = aTopicPattern
    }
  }

  get regexp (): RegExp {
    return this._regexp
  }

  get topic (): string {
    return this._topic
  }
  get pattern (): string {
    return this._pattern
  }

  test (aTopicToTest: string): boolean {
    return this.regexp.test(aTopicToTest)
  }

  match (aTopicToTest: string): string[]|null {
    let matches: RegExpExecArray|null = this.regexp.exec(aTopicToTest)
    if (matches) {
      let params: string[] = []
      for (let i = 1;
            i < matches.length;
            i++) {
        params.push(matches[i])
      }
      return params

    } else {
      return null
    }

  }
}
