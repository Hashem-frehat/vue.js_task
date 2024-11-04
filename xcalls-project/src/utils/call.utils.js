export const callUtils = {
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  },

  formatDate(date) {
    return new Date(date).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  },

  getCallType(type) {
    const types = {
      inbound: 'وارد',
      outbound: 'صادر',
      rejected: 'مرفوض',
    }
    return types[type] || 'غير معروف'
  },

  getCallStatus(status) {
    const statuses = {
      ringing: 'جاري الرنين',
      inProgress: 'قيد التقدم',
      completed: 'مكتمل',
      rejected: 'مرفوض',
      missed: 'لم يتم الرد',
      failed: 'فشل الاتصال',
    }
    return statuses[status] || 'حالة غير معروفة'
  },
}
