export interface Question {
    id: number;
    title: string;
    body: string;
}

export interface Answer {
    body: string;
    isAccepted: boolean;
}
