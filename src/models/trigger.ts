
 export interface ITrigger {
    triggerName: string,
    triggerGroup: string,
    triggerDescription: string,
    cronExpressionString: string,
    previousFireTime: Date,
    nextFireTime: Date,
    triggerState: string
 
  }
  
 
  export interface IUpdateTriggerArgs {
    triggerName: string,
    triggerGroup: string,
  }
  
  

  export interface ITriggerArgs {
  
    triggerName: string,
    triggerGroup: string,
  
  }
  
  
 