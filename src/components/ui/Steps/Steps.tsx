import { Steps as AntSteps } from 'antd'
import type { StepsProps as AntStepsProps } from 'antd'
import './Steps.scss'

export interface StepsProps extends AntStepsProps {}

const Steps = ({ className = '', ...rest }: StepsProps) => {
  return (
    <AntSteps
      className={`app-steps ${className}`}
      {...rest}
    />
  )
}

export default Steps
