
type TimelineKey = string;
export type Timeline = [TimelineKey, number][]

export function getDuration(timeline:Timeline, key: TimelineKey): number  {
    const index = timeline.findIndex(entry => entry[0].toLowerCase() === key.toLowerCase());

    if (index !== -1 && index < timeline.length - 1) {
        const currentTimestamp = timeline[index][1];
        const nextTimestamp = timeline[index + 1][1];

        return nextTimestamp - currentTimestamp;
    }

    throw new Error("Not in timeline");
}

export function getDurationFromTo(timeline:Timeline, fromKey:TimelineKey, toKey:TimelineKey):number {
    const start = timeline.findIndex(entry => entry[0].toLowerCase() === fromKey.toLowerCase());
    const end = timeline.findIndex(entry => entry[0].toLowerCase() === toKey.toLowerCase());

    return timeline[end][1]-timeline[start][1];

}
