import { Pipe, PipeTransform } from '@angular/core';
import { Candidate } from '../../../core/models/models';
@Pipe({name:'filterStage',standalone:true,pure:true})
export class FilterStagePipe implements PipeTransform { transform(items:Candidate[],stage:number):Candidate[]{return items.filter(x=>x.stage===stage);} }
