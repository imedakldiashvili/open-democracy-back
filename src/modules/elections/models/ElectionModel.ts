

export class ElectionModel {
    id: number
    code: string
    name: string
    date: Date
    assetStatusTaskTypes: ElectionPollingStationModel[] = []
  }
  
  export class ElectionPollingStationModel {
    pollingStationId: number
    electionBallots: ElectionBallotModel[] = []
  }

  export class ElectionBallotModel {
    ballotTypeId: number
    code: string
    name: string
  }




