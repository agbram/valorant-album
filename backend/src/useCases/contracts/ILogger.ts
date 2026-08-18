export type AdditionalFieldsToLog = object

export type OptionsLog = { omitAdditionalFieldsToFile?: string[] }

export interface ILogger {
  debugReport: (
    message: string,
    additionalFields?: AdditionalFieldsToLog,
    optionsLog?: OptionsLog
  ) => void

  informationReport: (
    message: string,
    additionalFields?: AdditionalFieldsToLog,
    optionsLog?: OptionsLog
  ) => void

  warningReport: (
    message: string,
    additionalFields?: AdditionalFieldsToLog,
    optionsLog?: OptionsLog
  ) => void

  errorReport: (
    message: string,
    additionalFields?: AdditionalFieldsToLog,
    optionsLog?: OptionsLog
  ) => void
}
