import React from 'react'

interface ExperimentLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
}

export const ExperimentLayout: React.FC<ExperimentLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      <div>{children}</div>
    </section>
  )
}
