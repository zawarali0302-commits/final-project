interface DeleteFormProps {
    action: () => void
}
const DeleteForm = ({action}: DeleteFormProps) => {
  return (
    <form action={action}>
      <button type="submit">Delete</button>
    </form>
  )
}

export default DeleteForm
