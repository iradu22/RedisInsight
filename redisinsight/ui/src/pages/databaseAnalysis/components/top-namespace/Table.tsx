import React, { useState } from 'react'
import {
  EuiBasicTableColumn,
  EuiInMemoryTable,
  EuiButtonIcon,
  EuiButtonEmpty,
  EuiToolTip,
  PropertySort
} from '@elastic/eui'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { formatBytes, formatLongName, Nullable } from 'uiSrc/utils'
import { numberWithSpaces } from 'uiSrc/utils/numbers'
import { GroupBadge } from 'uiSrc/components'
import { Pages } from 'uiSrc/constants'
import { setFilter, setSearchMatch, resetKeysData, fetchKeys, keysSelector } from 'uiSrc/slices/browser/keys'
import { SCAN_COUNT_DEFAULT, SCAN_TREE_COUNT_DEFAULT } from 'uiSrc/constants/api'
import { KeyViewType } from 'uiSrc/slices/interfaces/keys'
import { setBrowserTreeDelimiter, setBrowserKeyListDataLoaded, resetBrowserTree } from 'uiSrc/slices/app/context'
import { NspSummary } from 'apiSrc/modules/database-analysis/models/nsp-summary'
import { NspTypeSummary } from 'apiSrc/modules/database-analysis/models/nsp-type-summary'

import styles from './styles.module.scss'

export interface Props {
  data: Nullable<NspSummary[]>
  defaultSortField: string
  delimiter: string
  dataTestid?: string
}

const NameSpacesTable = (props: Props) => {
  const { data, defaultSortField, delimiter, dataTestid = '' } = props
  const [sort, setSort] = useState<PropertySort>({ field: defaultSortField, direction: 'desc' })
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({})

  const history = useHistory()
  const dispatch = useDispatch()

  const { instanceId } = useParams<{ instanceId: string }>()

  const { viewType } = useSelector(keysSelector)

  const handleRedirect = (nsp: string, filter: string) => {
    dispatch(setBrowserTreeDelimiter(delimiter))
    dispatch(setFilter(filter))
    dispatch(setSearchMatch(`${nsp}${delimiter}*`))
    dispatch(resetKeysData())
    dispatch(fetchKeys(
      '0',
      viewType === KeyViewType.Browser ? SCAN_COUNT_DEFAULT : SCAN_TREE_COUNT_DEFAULT,
      () => dispatch(setBrowserKeyListDataLoaded(true)),
      () => dispatch(setBrowserKeyListDataLoaded(false)),
    ))
    dispatch(resetBrowserTree())
    history.push(Pages.browser(instanceId))
  }

  const toggleDetails = (item: NspSummary) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap }
    if (itemIdToExpandedRowMapValues[item.nsp]) {
      delete itemIdToExpandedRowMapValues[item.nsp]
    } else {
      itemIdToExpandedRowMapValues[item.nsp] = (
        <div style={{ width: '100%' }}>
          {item.types.map((type, index) => {
            const [number, size] = formatBytes(type.memory, 3, true)
            return (
              <div className={styles.expanded} key={type.type} data-testid={`expanded-${item.nsp}-${index}`}>
                <div className="truncateText">
                  <EuiToolTip
                    anchorClassName={styles.tooltip}
                    position="bottom"
                    content={`${item.nsp}:*`}
                  >
                    <EuiButtonEmpty
                      className={cx(styles.link, styles.expanded)}
                      onClick={() => handleRedirect(item.nsp as string, type.type)}
                    >
                      {`${item.nsp}${delimiter}*`}
                    </EuiButtonEmpty>
                  </EuiToolTip>
                </div>
                <div><GroupBadge type={type.type} /></div>
                <div className={styles.rightAlign}>
                  <span className={styles.count} data-testid="usedMemory-value">
                    {number}
                  </span>
                  <span className={styles.valueUnit}>{size}</span>
                </div>
                <div className={styles.rightAlign}>{type.keys}</div>
              </div>
            )
          })}
        </div>
      )
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues)
  }

  const setDataTestId = ({ nsp }: { nsp: string }) => ({
    'data-testid': `row-${nsp}`
  })

  const columns: EuiBasicTableColumn<NspSummary>[] = [
    {
      name: 'Key Pattern',
      field: 'nsp',
      dataType: 'string',
      height: '42px',
      align: 'left',
      width: 'auto',
      sortable: true,
      truncateText: true,
      className: 'nsp-cell',
      render: (nsp: string, { types }: { types: any[] }) => {
        const filterType = types.length > 1 ? null : types[0].type
        const textWithDelimiter = `${nsp}${delimiter}*`
        const cellContent = textWithDelimiter?.substring(0, 200)
        const tooltipContent = formatLongName(textWithDelimiter)
        return (
          <div className={cx(styles.delimiter, 'truncateText')}>
            <EuiToolTip
              anchorClassName={styles.tooltip}
              position="bottom"
              content={tooltipContent}
            >
              <EuiButtonEmpty
                className={styles.link}
                onClick={() => handleRedirect(nsp, filterType)}
              >
                {cellContent}
              </EuiButtonEmpty>
            </EuiToolTip>
          </div>
        )
      }
    },
    {
      name: 'Data Type',
      field: 'types',
      width: '32%',
      align: 'left',
      className: 'dataType',
      render: (value: NspTypeSummary[]) => (
        <div className={styles.badgesContainer}>
          {value.map(({ type }) => <GroupBadge key={type} type={type} className={styles.badge} />)}
        </div>
      )
    },
    {
      name: 'Total Memory',
      field: 'memory',
      width: '13%',
      sortable: true,
      align: 'right',
      render: (value: number) => {
        const [number, size] = formatBytes(value, 3, true)

        return (
          <EuiToolTip
            content={`${numberWithSpaces(value)} B`}
            data-testid="usedMemory-tooltip"
          >
            <>
              <span className={styles.count} data-testid={`nsp-usedMemory-value=${value}`}>
                {number}
              </span>
              <span className={styles.valueUnit}>{size}</span>
            </>
          </EuiToolTip>
        )
      }
    },
    {
      name: 'Total Keys',
      field: 'keys',
      width: '11%',
      sortable: true,
      align: 'right',
      render: (value: number) => (
        <span className={styles.count} data-testid={`keys-value-${value}`}>
          {numberWithSpaces(value)}
        </span>
      )
    },
    {
      name: '\u00A0',
      width: '42px',
      className: 'expandBtn',
      isExpander: true,
      render: (item: NspSummary) => {
        const { types, nsp } = item
        return (
          <>
            {types.length > 1 && (
              <EuiButtonIcon
                style={{ marginRight: '6px' }}
                onClick={() => toggleDetails(item)}
                aria-label={itemIdToExpandedRowMap[nsp] ? 'Collapse' : 'Expand'}
                iconType={itemIdToExpandedRowMap[nsp] ? 'arrowUp' : 'arrowDown'}
                data-testid={`expand-arrow-${nsp}`}
              />
            )}
          </>
        )
      },
    },
  ]

  return (
    <div className={styles.wrapper} data-testid={dataTestid}>
      <div className={styles.tableWrapper}>
        <EuiInMemoryTable
          items={data ?? []}
          columns={columns}
          className={cx('inMemoryTableDefault', 'noHeaderBorders', 'stickyHeader', 'fixedLayout', styles.table)}
          responsive={false}
          itemId="nsp"
          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          isExpandable
          rowProps={setDataTestId}
          sorting={{ sort }}
          onTableChange={({ sort }: any) => setSort(sort)}
          data-testid="nsp-table"
        />
      </div>
    </div>
  )
}

export default NameSpacesTable
