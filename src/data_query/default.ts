import { PageDefinition } from '..'
import { Filter } from '../filter'

export interface DataQueryParams {
  range?: string
  sort?: string
  filter?: string
}

export const buildDataQuery = (
  def: PageDefinition,
  filter: Filter
): DataQueryParams => {
  const rangeQ = JSON.stringify([
    def.pageSize * def.page,
    def.pageSize * (def.page + 1),
  ] as number[])

  let sortQ: string | undefined
  if (def.sorting) {
    const sortingDirectionString =
      def.sorting.direction === 'desc' ? ' desc' : 'asc'
    sortQ = JSON.stringify([def.sorting.columnName, sortingDirectionString])
  }
  let filterQ: string | undefined
  if (filter) {
    filterQ = JSON.stringify(filter)
  }

  return { range: rangeQ, sort: sortQ, filter: filterQ }
}
