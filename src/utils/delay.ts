export default function delay(time : number) : Promise<null> {
  return new Promise((res, rej) => {
    setTimeout(res, time)
  })
}
