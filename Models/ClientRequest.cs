using System.ComponentModel.DataAnnotations;

namespace iOmniEYE.Models
{
    public class CrmUser
    {
        public int Id { get; set; }
        public string TelegramUsername { get; set; }  // @username
        public long TelegramId { get; set; }          // chat_id
        public string DisplayName { get; set; }       // ФИО или имя

        public List<ClientRequest> AssignedRequests { get; set; }
    }

    public class ClientRequest
    {
        [Key] // Явно указывает EF, что это первичный ключ
        public int Id { get; set; }

        [Required(ErrorMessage = "Имя обязательно")]
        [MaxLength(60, ErrorMessage = "Имя не должно превышать 60 символов.")]
        [Display(Name = "Имя клиента")]
        public string ClientName { get; set; }

        [Display(Name = "Название компании")]
        [MaxLength(60, ErrorMessage = "Название компании не должно превышать 60 символов.")]
        public string? CompanyName { get; set; }

        [Required(ErrorMessage = "Телефон обязателен")]
        [Display(Name = "Телефон")]
        [Phone(ErrorMessage = "Неверный формат телефона")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Email обязателен")]
        [Display(Name = "Электронная почта")]
        [EmailAddress(ErrorMessage = "Неверный формат email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Поле обязательно")]
        [Display(Name = "Текст заявки")]
        [MaxLength(600, ErrorMessage = "Сообщение не должно превышать 600 символов.")]
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "New"; // New, In Progress, Closed, Cancelled

        public int? AssignedUserId { get; set; }
        public CrmUser? AssignedUser { get; set; }
    }
}
