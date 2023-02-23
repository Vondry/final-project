
// TODO: typicky se pouzivaji knihovny jako https://github.com/jquense/yup, nebo dneska take hodne https://github.com/colinhacks/zod
export default {
  required (value) {
    return value === 0 || !!value
  },
  minLength (value, par) {
    return (typeof value === 'string') && (value.length >= par)
  },
  maxLength (value, par) {
    return (typeof value === 'string') && (value.length <= par)
  }
}