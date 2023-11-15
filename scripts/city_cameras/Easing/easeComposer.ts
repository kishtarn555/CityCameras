import { EaseFunction } from "./easeFunction";

export type EaseComposerSegment=[number, number, EaseFunction]
export class EaseComposer {
    private durations:number[];
    private magnitudes:number[]
    private easers:EaseFunction[];
    /**
     * 
     * @param segments Array of segments, each semgnet is a tuple and it's the duration, magnitude, and easing function
     */
    constructor(segments:EaseComposerSegment[]) {
        this.durations=[]
        this.easers=[]
        this.magnitudes=[]
        let totalLength=0;
        let totalMagnitude=0;
        for (let [duration, magnitude, easer] of segments) {
            this.easers.push(easer);
            this.magnitudes.push(magnitude);
            this.durations.push(duration);
            totalLength+=duration;
            totalMagnitude+=magnitude;
        }
        for (let i =0; i < this.durations.length;i++) {
            this.durations[i]/=totalLength;
            this.magnitudes[i]/=totalMagnitude;
        }
    }



    get(x:number):number {
        //This could be improved with binary search, but it probably isn't worth it
        let lengthSum=0;
        let magnitudeSum=0;
        for (let i =0; i < this.easers.length;i++) {
            const cDuration = this.durations[i];
            const start = lengthSum;
            const end = lengthSum+cDuration;
            
            
            const cMagnitude = this.magnitudes[i];
            const mStart = magnitudeSum;
            const mEnd = magnitudeSum+cMagnitude;
            if (x <= end) {
                const local = (x-start)/cDuration;
                const alpha = this.easers[i](local);
                return mStart*(1-alpha)+mEnd*(alpha);
            }
            lengthSum+=this.durations[i];
            magnitudeSum+=this.magnitudes[i];
        }
        return 1;
    }
}