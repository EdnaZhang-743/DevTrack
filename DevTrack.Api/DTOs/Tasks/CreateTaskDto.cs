namespace DevTrack.Api.DTOs.Tasks;

public class CreateTaskDto
{
    public int ProjectId { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Priority { get; set; } = "Medium";
    public DateTime? DueDate { get; set; }
}