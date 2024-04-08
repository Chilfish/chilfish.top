type DataOrError<T> = T | Error

export async function toSeriesPromises<T = any>(
  promises: (() => Promise<DataOrError<T>>)[],
) {
  const result: DataOrError<T>[] = []

  for (const promise of promises) {
    try {
      const data = await promise()
      result.push(data)
    }
    catch (error: any) {
      result.push(error)
    }
  }

  return result
}

function delay() {
  const isError = Math.random() > 0.5
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (isError)
        reject(new Error('Error'))
      else
        resolve('Success')
    }, 1000)
  })
}

const promises = Array.from({ length: 5 }, () => delay)

console.time('toSeriesPromises')

const data = await toSeriesPromises(promises)

data.forEach((ele) => {
  const isError = ele instanceof Error

  console.log(isError ? ele.message : ele)
})

console.timeEnd('toSeriesPromises')

export {

}
