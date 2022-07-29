export interface RedditComments {
  id: string,
  comment: string,
  level: string,
  votes: string,
  user: string
}
export interface RedditData {
  id: string,
  bg: string,
  title: string,
  votes: string,
  link: string,
  user: string,
  comments: RedditComments[]
}



export interface RedditPostProps {
  id: string,
  user: string,
  upVotes: string,
  text: string,
  isQuestion: boolean,
}
