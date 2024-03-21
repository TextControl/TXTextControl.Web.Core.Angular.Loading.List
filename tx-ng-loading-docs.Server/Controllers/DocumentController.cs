using Microsoft.AspNetCore.Mvc;

namespace tx_ng_loading_docs.Server.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class DocumentController : ControllerBase
	{
		private readonly ILogger<DocumentController> _logger;

		public DocumentController(ILogger<DocumentController> logger)
		{
			_logger = logger;
		}

		[HttpGet]
		[Route("List")]
		public IEnumerable<DocumentData> List()
		{
			// file all file names from App_Data
			var files = Directory.GetFiles("App_Data");
			var data = new List<DocumentData>();
			foreach (var file in files)
			{
				data.Add(new DocumentData
				{
					Name = Path.GetFileName(file),
				});
			}
			return data;
		}

		[HttpGet]
		[Route("Load")]
		public DocumentData Load(string name)
		{
			// load the file from App_Data
			var file = Path.Combine("App_Data", name);
			var data = new DocumentData
			{
				Name = name,
				Data = Convert.ToBase64String(System.IO.File.ReadAllBytes(file)),
			};
			return data;
		}

		[HttpPost]
		[Route("Save")]
		public bool Save([FromBody] DocumentData documentData)
		{
			// save the file to App_Data
			var file = Path.Combine("App_Data", documentData.Name);
			System.IO.File.WriteAllBytes(file, Convert.FromBase64String(documentData.Data));
			return true;
		}

	}
}
