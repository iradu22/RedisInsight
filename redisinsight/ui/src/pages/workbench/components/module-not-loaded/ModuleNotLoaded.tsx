import React, { useContext } from 'react'
import cx from 'classnames'
import {
  EuiBasicTableColumn,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiInMemoryTable,
  EuiText,
  EuiTextColor,
} from '@elastic/eui'
import parse from 'html-react-parser'

import { ThemeContext } from 'uiSrc/contexts/themeContext'
import { Theme } from 'uiSrc/constants'
import { HELP_LINKS } from 'uiSrc/pages/home/constants/help-links'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import styles from './styles.module.scss'

interface IContentColumn {
  title: string
  text: string
}

export interface IModuleNotLoadedContent {
  output?: string
  createCloudBtnText?: string
  createCloudBtnHref?: string
  summaryText?: string
  summaryImgDark?: string
  summaryImgLight?: string
  summaryImgPath?: string
  columns?: IContentColumn[]
}

export interface Props {
  content: IModuleNotLoadedContent
}

const ModuleNotLoaded = ({ content = {} }: Props) => {
  const {
    output = '',
    createCloudBtnText = '',
    createCloudBtnHref = '',
    summaryText = '',
    summaryImgDark = '',
    summaryImgLight = '',
    summaryImgPath = '',
    columns = []
  } = content

  const { theme } = useContext(ThemeContext)

  const columnsSettings: EuiBasicTableColumn<any>[] = columns.map(({ title }, i) => ({
    name: title,
    field: `text${i}`,
    dataType: 'string',
    truncateText: false,
    render: (text: any) => parse(text)
  }))

  const item = columns.reduce((obj, { text }, i) => ({ ...obj, [`text${i}`]: text }), {})

  const handleClickLink = (event: TelemetryEvent, eventData: any = {}) => {
    sendEventTelemetry({
      event,
      eventData: {
        ...eventData
      }
    })
  }

  const CreateCloudBtn = () => (
    <a
      className={styles.createCloudBtn}
      href={createCloudBtnHref}
      target="_blank"
      rel="noreferrer"
      onClick={() => handleClickLink(
        HELP_LINKS.createRedisCloud.event,
        { source: HELP_LINKS.createRedisCloud.sources.redisearch }
      )}
      data-testid="promo-btn"
    >
      <EuiText className={styles.createTitle}>
        {HELP_LINKS.createRedisCloud.label}
      </EuiText>
      <EuiText className={styles.createText}>
        Try Redis Cloud with enhanced database capabilities.
      </EuiText>
      <EuiIcon type="arrowRight" size="m" className={styles.arrowRight} />
    </a>
  )

  return (
    <div className={cx(styles.container)}>
      <EuiFlexGroup direction="column" gutterSize="s">
        {!!output && (
        <EuiFlexItem className="query-card-output-response-fail">
          <span data-testid="query-card-no-module-output">
            <span className={styles.alertIconWrapper}>
              <EuiIcon type="alert" color="danger" style={{ display: 'inline', marginRight: 10 }} />
            </span>
            <EuiTextColor color="danger">{parse(output)}</EuiTextColor>
          </span>
        </EuiFlexItem>
        )}
        {!!columns?.length && (
          <EuiFlexItem>
            <EuiInMemoryTable
              className={cx('inMemoryTableDefault', 'imtd-multiLineCells', styles.table)}
              columns={columnsSettings}
              items={[item]}
              data-test-subj="query-card-no-module-table"
            />
          </EuiFlexItem>
        )}
        {!!createCloudBtnText && (
          <EuiFlexItem grow={false} data-testid="query-card-no-module-button">
            <CreateCloudBtn />
          </EuiFlexItem>
        ) }
        {(!!summaryText || !!summaryImgPath || !!summaryImgDark || !!summaryImgLight) && (
          <EuiFlexItem>
            <div className={cx(styles.summary)}>
              {(!!summaryImgPath || !!summaryImgDark || !!summaryImgLight) && (
                <div>
                  <img
                    src={theme === Theme.Dark ? summaryImgDark : summaryImgLight}
                    className={cx(styles.summaryImg)}
                    data-testid="query-card-no-module-summary-img"
                    alt="redisearch table"
                  />
                </div>
              )}
              {!!summaryText && <div data-testid="query-card-no-module-summary-text">{parse(summaryText)}</div>}
            </div>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </div>
  )
}

export default ModuleNotLoaded
