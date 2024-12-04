import json
import os
from mistralai import Mistral

client = Mistral(api_key=os.environ.get("LLM_API_KEY"))


def generate_schedules(client: Mistral, notifications: list[map]):
    chat_response = client.chat.complete(
        model="mistral-large-latest",
        messages=[
            {
                "role": "user",
                "content": f"""
                    Jadi saya mempunyai sebuah aplikasi untuk memonitoring bayi
                    ketika dia menangis ataupun merasakan ketidaknyamanan. Data tersebut
                    disimpan sebagai JSON. Berikut adalah jsonnya: 
                    
                    {json.dumps(notifications)}
                    
                    Dari json tersebut saya mau kamu untuk membuat sebuah schedule perharinya. Schedulenya berupa
                    hal yang kira-kira sangatlah esensial bagi bayinya, sehingga dirasa harus dilakukan oleh orang tua
                    secara rutin. Untuk jam pada schedulenya harus ada jam pagi, siang, sore, 
                    dan malam. Saya mau nilai balikannya juga berupa json dan HANYA jsonnya saja! 
                    
                    Untuk format jsonnya adalah sebagai berikut: 
                    {'{ "title": <string>, "description": <string>, "time": <isostring>}'}
                    
                    Ingat saya mau nilai balikannya hanya json.
                """,
            },
        ],
        response_format={"type": "json_object"},
    )

    return chat_response.choices[0].message.content


# generate_schedules(
#     client,
#     [
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because he is cold",
#             "created_at": "2024-11-27T21:42:25.560127Z",
#             "updated_at": "2024-11-27T21:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because he is too hot",
#             "created_at": "2024-11-27T22:42:25.560127Z",
#             "updated_at": "2024-11-27T22:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because his clothes are itchy",
#             "created_at": "2024-11-28T00:42:25.560127Z",
#             "updated_at": "2024-11-28T00:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because of gas in his stomach",
#             "created_at": "2024-11-28T01:42:25.560127Z",
#             "updated_at": "2024-11-28T01:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because he is teething",
#             "created_at": "2024-11-28T02:42:25.560127Z",
#             "updated_at": "2024-11-28T02:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because of a wet blanket",
#             "created_at": "2024-11-28T03:42:25.560127Z",
#             "updated_at": "2024-11-28T03:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because he has a mild fever",
#             "created_at": "2024-11-28T04:42:25.560127Z",
#             "updated_at": "2024-11-28T04:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because he is overstimulated",
#             "created_at": "2024-11-28T05:42:25.560127Z",
#             "updated_at": "2024-11-28T05:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he is bored",
#             "created_at": "2024-11-28T06:42:25.560127Z",
#             "updated_at": "2024-11-28T06:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he is scared",
#             "created_at": "2024-11-28T07:42:25.560127Z",
#             "updated_at": "2024-11-28T07:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he wants to be held",
#             "created_at": "2024-11-28T08:42:25.560127Z",
#             "updated_at": "2024-11-28T08:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he lost his pacifier",
#             "created_at": "2024-11-28T09:42:25.560127Z",
#             "updated_at": "2024-11-28T09:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he has diaper rash",
#             "created_at": "2024-11-28T10:42:25.560127Z",
#             "updated_at": "2024-11-28T10:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he is uncomfortable in his car seat",
#             "created_at": "2024-11-28T11:42:25.560127Z",
#             "updated_at": "2024-11-28T11:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he is feeling sleepy but can't settle",
#             "created_at": "2024-11-28T12:42:25.560127Z",
#             "updated_at": "2024-11-28T12:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because his swaddle is too tight",
#             "created_at": "2024-11-28T13:42:25.560127Z",
#             "updated_at": "2024-11-28T13:42:25.560127Z",
#         },
#         {
#             "title": "Discomfort",
#             "picture": "discomfort.jpg",
#             "clarification": "the baby is feeling discomfort because he has an earache",
#             "created_at": "2024-11-28T14:42:25.560127Z",
#             "updated_at": "2024-11-28T14:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he is startled by a loud noise",
#             "created_at": "2024-11-28T15:42:25.560127Z",
#             "updated_at": "2024-11-28T15:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he wants to play",
#             "created_at": "2024-11-28T16:42:25.560127Z",
#             "updated_at": "2024-11-28T16:42:25.560127Z",
#         },
#         {
#             "title": "Crying",
#             "picture": "crying.jpg",
#             "clarification": "the baby is crying because he doesn't like the taste of his food",
#             "created_at": "2024-11-28T17:42:25.560127Z",
#             "updated_at": "2024-11-28T17:42:25.560127Z",
#         },
#     ],
# )
