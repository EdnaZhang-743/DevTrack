using System.Text.Json.Serialization;

namespace DevTrack.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Status { get; set; } = "Todo";
    public string Priority { get; set; } = "Medium";
    public DateTime? DueDate { get; set; }

    public int ProjectId { get; set; }

    [JsonIgnore]
    public Project? Project { get; set; }
}