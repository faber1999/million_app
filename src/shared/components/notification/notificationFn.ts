import { createElement } from 'react'
import { Notification, type NotificationProps } from './Notification'

export const notification = (props: NotificationProps) => createElement(Notification, props)
