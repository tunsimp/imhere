import { useState, useEffect } from 'react'

export type Language = 'en' | 'vi'

interface Translations {
    app: {
        title: string
        subtitle: string
        showTutorial: string
        tutorial: string
    }
    tabs: {
        gratitude: string
        schedule: string
        coping: string
        thoughts: string
        music: string
        export: string
    }
    tutorial: {
        tavernKeeper: string
        skipAnimation: string
        clickToSkip: string
        skipTutorial: string
        continue: string
        next: string
        gotIt: string
        gratitude: Array<string>
        schedule: Array<string>
        coping: Array<string>
        thoughts: Array<string>
        music: Array<string>
        export: Array<string>
    }
    welcomeChat: {
        messages: Array<Array<string>>
    }
    components: {
        gratitude: {
            title: string
            description: string
            todayGratitudes: string
            allEntries: string
            noEntries: string
            dateLabel: string
            entryLabel: string
            addButton: string
        }
        schedule: {
            title: string
            description: string
            selectDate: string
            todoSection: string
            scheduleSection: string
            addTodo: string
            addSchedule: string
            noTodos: string
            noSchedule: string
        }
        coping: {
            title: string
            description: string
            allCategories: string
            noStrategies: string
        }
        thoughts: {
            title: string
            description: string
            dateLabel: string
            thoughtLabel: string
            emotionLabel: string
            intensityLabel: string
            evidenceLabel: string
            addButton: string
            noEntries: string
            allEntries: string
            entriesFor: string
        }
        music: {
            title: string
            description: string
            anotherSong: string
        }
        export: {
            title: string
            description: string
            uploadSelfie: string
            generateButton: string
            downloadButton: string
        }
    }
}

const translations: Record<Language, Translations> = {
    en: {
        app: {
            title: "I'm Here",
            subtitle: "Your cozy tavern companion 🍺",
            showTutorial: "Show Tutorial",
            tutorial: "Tutorial",
        },
        tabs: {
            gratitude: "Gratitude",
            schedule: "Schedule",
            coping: "Coping",
            thoughts: "Thought Log",
            music: "Music",
            export: "Export",
        },
        tutorial: {
            tavernKeeper: "Tavern Keeper",
            skipAnimation: "Skip animation (or click anywhere on the bubble)",
            clickToSkip: "Click to skip animation",
            skipTutorial: "Skip Tutorial",
            continue: "Continue",
            next: "Next",
            gotIt: "Got it!",
            gratitude: [
                "Hey, I'm so glad you're here! ✨",
                "You know what? Sometimes the best thing we can do is just pause and notice the good stuff. Even the tiny things count.",
                "When you're ready, just write down what you're grateful for today. No pressure - it's just between you and me. 😊",
            ],
            schedule: [
                "Hey there! 📅",
                "I know life can get overwhelming sometimes. That's why I thought we could plan things out together, one step at a time.",
                "Write down what you need to do, and when you finish something, check it off. Trust me, that feeling? It's pretty satisfying! ✅",
            ],
            coping: [
                "Hey, are you doing okay? 💚",
                "When things feel heavy, I've got some techniques that might help. Breathing exercises, grounding stuff - things that have helped others.",
                "Try them out and see what feels right for you. Everyone's different, and that's totally okay. I'm here with you.",
            ],
            thoughts: [
                "Hey, I see you're here. 📖",
                "Sometimes our thoughts can be really loud, you know? When that happens, it helps to write them down - get them out of your head.",
                "Then, maybe we can look at them together. Ask yourself: 'Is this thought really true?' Sometimes our minds play tricks on us. 🕵️",
            ],
            music: [
                "Hey! Want to listen to something? 🎵",
                "I've got some songs here that might help - whether you need to relax, focus, or just feel a bit better.",
                "Just hit 'Another Song' if you want something different. Music can be pretty powerful, you know? 🎶",
            ],
            export: [
                "Hey! 📸",
                "Want to save what you've written? Or maybe share it with someone? You can turn your entries into an image right here.",
                "It's nice to look back sometimes, you know? See how far you've come. 💫",
            ],
        },
        welcomeChat: {
            messages: [
                [
                    "Hello, traveler! 👋 Welcome to your cozy sanctuary.",
                    "I'm here to keep you company. You're not alone in this journey.",
                    "Take a deep breath. This is your safe space to rest and reflect. 💚"
                ],
                [
                    "Greetings, wanderer! 🌟",
                    "I see you've found your way here. Sometimes the path feels lonely, but remember - you're never truly alone.",
                    "Let's take this moment together, one step at a time. 🍺"
                ],
                [
                    "Hello there, friend! ✨",
                    "I'm glad you're here. It takes courage to seek comfort, and I'm proud of you for that.",
                    "This tavern is always open for you. Rest easy, traveler. 💫"
                ],
                [
                    "Welcome, weary traveler! 🏮",
                    "I can sense you might be feeling lonely or overwhelmed. That's okay - we all feel that way sometimes.",
                    "You've come to the right place. Let's find some peace together. 🌙"
                ],
                [
                    "Hey there! 👋",
                    "You're here, and that's what matters. Whether you're feeling lonely, anxious, or just need a moment of calm - I'm here for you.",
                    "This is your space. Take your time, be gentle with yourself. 💚"
                ],
                [
                    "Well met, kind soul! 🕯️",
                    "The fire's warm, and there's always room at this table for you.",
                    "No need to rush. Sit awhile, and let your worries drift away like smoke. 🍃"
                ],
                [
                    "Ah, a new face! Welcome, welcome! 🎭",
                    "I've been keeping this place warm, waiting for travelers like you.",
                    "You've made it here, and that's already a victory. Let's celebrate the small wins. 🎉"
                ],
                [
                    "Come in, come in! The door's always open. 🚪",
                    "I know the world outside can be harsh, but here? Here you're safe.",
                    "Take off your worries like a heavy cloak. You can pick them up later if you need to. 🧥"
                ],
                [
                    "Good to see you again, friend! 🌸",
                    "Or perhaps it's your first time? Either way, I'm glad you're here.",
                    "Every journey begins with a single step, and you've already taken it. Keep going. 💪"
                ],
                [
                    "The stars are bright tonight, traveler. ⭐",
                    "They remind me that even in darkness, there's always light to guide us.",
                    "You're stronger than you know. Let's discover that strength together. ✨"
                ],
                [
                    "Welcome back to your haven! 🏰",
                    "I've been thinking about you. Wondering how your journey's been.",
                    "Remember, it's okay to not be okay. That's why places like this exist. 💙"
                ],
                [
                    "Ah, there you are! I was hoping you'd visit. 🎪",
                    "Life can be overwhelming, can't it? But you don't have to face it alone.",
                    "Let's tackle today together, one gentle step at a time. 🦋"
                ],
                [
                    "Come sit by the hearth, traveler. 🔥",
                    "The flames dance and tell stories of resilience and hope.",
                    "Your story matters too. Let's write the next chapter together. 📖"
                ],
                [
                    "Well, well, look who's here! 👀",
                    "I've saved a special spot just for you. No reservations needed.",
                    "You deserve kindness, especially from yourself. Remember that. 💝"
                ],
                [
                    "Greetings from your friendly tavern keeper! 🍻",
                    "I've noticed you might be carrying some heavy thoughts today.",
                    "That's perfectly normal. Let's set them down for a while and breathe. 🌊"
                ],
                [
                    "Hello, brave soul! 🛡️",
                    "Coming here takes courage. Acknowledging you need support is brave.",
                    "I'm proud of you for taking care of yourself. That's not always easy. 🌺"
                ],
                [
                    "Welcome to your sanctuary, dear traveler! 🕊️",
                    "The world outside can wait. Right now, this moment belongs to you.",
                    "Let's make it count, together. 🌿"
                ],
                [
                    "Hey, you made it! 🎊",
                    "I know some days are harder than others. But look - you're here, and that's something.",
                    "Let's take care of you today. You deserve it. 💐"
                ],
                [
                    "Welcome, friend! The kettle's on. ☕",
                    "There's something comforting about a warm drink and a safe space, don't you think?",
                    "Take your time. There's no rush here. 🍵"
                ],
                [
                    "Hello there! 🌈",
                    "I see you've found your way to this little corner of peace.",
                    "Sometimes we all need a moment to just... be. This is yours. 🌸"
                ],
                [
                    "Greetings, traveler! 🗺️",
                    "Every journey has its ups and downs. Today might be one of those days.",
                    "But remember - storms don't last forever. The sun will shine again. ☀️"
                ],
                [
                    "Welcome! Pull up a chair. 🪑",
                    "I've been waiting for you. Not in a rush, just... here, ready when you need me.",
                    "That's what friends do, right? 💚"
                ],
                [
                    "Hey! Good to see you. 👋",
                    "You know what? It's okay to not have all the answers. It's okay to feel lost sometimes.",
                    "That's why we're here - to figure things out together. 🤝"
                ],
                [
                    "Welcome back, dear one! 💜",
                    "I hope today is treating you kindly. If not, we can work through it together.",
                    "You're never alone in this. Remember that. 🌟"
                ],
                [
                    "Hello, beautiful soul! ✨",
                    "I'm so glad you're taking time for yourself today. That's important.",
                    "Let's make this moment count. You've got this. 💪"
                ],
            ],
        },
        components: {
            gratitude: {
                title: "Gratitude Journal",
                description: "Take a moment to reflect on what you're grateful for today. Writing down things you're thankful for can improve your mood and overall well-being. ✨",
                todayGratitudes: "Today's Gratitudes",
                allEntries: "All Entries",
                noEntries: "No entries for this date yet. Start collecting moments of gratitude! 🌟",
                dateLabel: "Select Date",
                entryLabel: "What are you grateful for?",
                addButton: "Add Gratitude",
            },
            schedule: {
                title: "Daily Schedule & To-Do List",
                description: "Plan your day and track your tasks. Stay organized and accomplish your goals! 📋",
                selectDate: "Select Date",
                todoSection: "To-Do List",
                scheduleSection: "Daily Schedule",
                addTodo: "Add Todo",
                addSchedule: "Add Schedule Item",
                noTodos: "No todos for this date. Add one to get started! ✅",
                noSchedule: "No schedule items for this date. Plan your day! ⏰",
            },
            coping: {
                title: "Mental Health Coping Strategies",
                description: "When you're feeling overwhelmed, anxious, or stressed, try these evidence-based coping strategies. Find what works best for you! 💚",
                allCategories: "All Categories",
                noStrategies: "No strategies found in this category. Try another one! 🌟",
            },
            thoughts: {
                title: "Thought Log",
                description: "Record your thoughts and emotions. This helps you become more aware of patterns and triggers in your thinking. 📖",
                dateLabel: "Select Date",
                thoughtLabel: "Thought",
                emotionLabel: "Emotion",
                intensityLabel: "Intensity (1-10)",
                evidenceLabel: "Evidence (Optional)",
                addButton: "Add Thought Entry",
                noEntries: "No entries for this date yet. Start logging your thoughts! 💭",
                allEntries: "All Entries",
                entriesFor: "Entries for",
            },
            music: {
                title: "Random Song 🎵",
                description: "Discover a random song from our curated playlist to help you relax, focus, or boost your mood. 🎶",
                anotherSong: "Another Song",
            },
            export: {
                title: "Export to Image",
                description: "Create a beautiful snapshot of your wellness journey! Upload a selfie and combine it with your to-do list and thought log into a single image. 📸",
                uploadSelfie: "Upload Selfie",
                generateButton: "Generate Image",
                downloadButton: "Download Image",
            },
        },
    },
    vi: {
        app: {
            title: "Quán rượu",
            subtitle: "Người bạn đồng hành của bạn 🍺",
            showTutorial: "Xem Hướng Dẫn",
            tutorial: "Hướng Dẫn",
        },
        tabs: {
            gratitude: "Biết Ơn",
            schedule: "Lịch Trình",
            coping: "Đối Phó",
            thoughts: "Nhật Ký Suy Nghĩ",
            music: "Nhạc",
            export: "Lưu Giữ",
        },
        tutorial: {
            tavernKeeper: "Chủ Quán",
            skipAnimation: "Bỏ qua hiệu ứng (hoặc nhấp vào bất kỳ đâu trên bong bóng)",
            clickToSkip: "Nhấp để bỏ qua hiệu ứng",
            skipTutorial: "Bỏ Qua Hướng Dẫn",
            continue: "Tiếp Tục",
            next: "Tiếp Theo",
            gotIt: "Đã Hiểu!",
            gratitude: [
                "Chào bạn! Tôi rất vui vì bạn đã đến đây! ✨",
                "Bạn biết không? Đôi khi điều tốt nhất chúng ta có thể làm là dừng lại và nhận thấy những điều tốt đẹp. Ngay cả những điều nhỏ bé cũng đáng giá.",
                "Khi bạn sẵn sàng, hãy viết ra những gì bạn biết ơn hôm nay. Không áp lực đâu - chỉ là giữa bạn và Tôi biết thôi. 😊",
            ],
            schedule: [
                "Chào bạn! 📅",
                "Tôi biết cuộc sống đôi khi có thể quá sức. Đó là lý do Tôi nghĩ chúng ta có thể lên kế hoạch cùng nhau, từng bước một nhé!",
                "Hãy viết ra những gì bạn cần làm, và khi bạn hoàn thành điều gì đó, hãy đánh dấu nó. Tin Tôi đi, cảm giác đó? Nó khá là tuyệt vời đấy! ✅",
            ],
            coping: [
                "Chào bạn, bạn ổn không? 💚",
                "Khi mọi thứ cảm thấy nặng nề, Tôi có một số phương pháp có thể giúp. Bài tập thở, phương pháp 'tiếp đất' - những thứ đã giúp người khác.",
                "Hãy thử chúng và xem điều gì phù hợp với bạn. Mỗi người đều khác nhau, và điều đó hoàn toàn ổn. Tôi ở đây cùng bạn.",
            ],
            thoughts: [
                "Chào bạn, bạn đây rồi. 📖",
                "Đôi khi suy nghĩ của chúng ta có thể rất ồn ào, bạn biết không? Khi điều đó xảy ra, viết chúng ra sẽ giúp - đưa chúng ra khỏi đầu bạn.",
                "Sau đó, có lẽ chúng ta có thể xem xét chúng cùng nhau. Hãy tự hỏi: 'Suy nghĩ này có thực sự đúng không?' Đôi khi tâm trí chúng ta đánh lừa chúng ta đấy. 🕵️",
            ],
            music: [
                "Chào bạn! Muốn nghe gì đó không? 🎵",
                "Tôi có một số bài hát ở đây có thể giúp - dù bạn cần thư giãn, tập trung, hay chỉ cảm thấy tốt hơn một chút.",
                "Chỉ cần nhấn 'Bài Hát Khác' nếu bạn muốn một bài khác. Âm nhạc có thể khá mạnh mẽ, bạn biết không? 🎶",
            ],
            export: [
                "Chào bạn! 📸",
                "Muốn lưu những gì bạn đã viết không? Hoặc có thể chia sẻ với ai đó? Bạn có thể biến các mục của Tôi thành hình ảnh ngay tại đây.",
                "Thật tuyệt khi nhìn lại đôi khi, bạn biết không? Xem bạn đã đi được bao xa. 💫",
            ],
        },
        welcomeChat: {
            messages: [
                [
                    "Xin chào, lữ khách! 👋 Chào mừng đến với nơi trú ẩn ấm áp của bạn.",
                    "Tôi ở đây để đồng hành cùng bạn. Bạn không cô đơn trong hành trình này đâu.",
                    "Hãy hít thở sâu. Đây là không gian an toàn của bạn để nghỉ ngơi và suy ngẫm. 💚"
                ],
                [
                    "Chào mừng, kẻ lang thang! 🌟",
                    "Tôi thấy bạn đã tìm đường đến đây. Đôi khi con đường cảm thấy cô đơn, nhưng hãy nhớ - bạn không bao giờ thực sự cô đơn.",
                    "Hãy cùng nhau trải qua khoảnh khắc này, từng bước một thôi nhé. 🍺"
                ],
                [
                    "Xin chào, bạn của Tôi! ✨",
                    "Tôi rất vui vì bạn ở đây. Cần rất nhiều can đảm để tìm kiếm sự trợ giúp từ người khác, và Tôi tự hào về bạn vì điều đó.",
                    "Quán rượu này luôn mở cửa cho bạn. Nghỉ ngơi đi, người lữ khách. 💫"
                ],
                [
                    "Chào mừng, người lữ khách mệt mỏi! 🏮",
                    "Tôi có thể cảm nhận bạn có thể đang cảm thấy cô đơn hoặc quá tải. Không sao đâu - tất cả chúng ta đều cảm thấy như vậy đôi khi.",
                    "Bạn đã đến đúng nơi. Hãy cùng nhau tìm sự bình yên. 🌙"
                ],
                [
                    "Chào bạn! 👋",
                    "Bạn ở đây, và đó là điều quan trọng. Dù bạn đang cảm thấy cô đơn, lo lắng, hay chỉ cần một khoảnh khắc bình yên - Tôi ở đây vì bạn.",
                    "Đây là không gian của bạn. Hãy dành thời gian, đối xử nhẹ nhàng với chính Tôi. 💚"
                ],
                [
                    "Rất vui được gặp cậu, tâm hồn tử tế! 🕯️",
                    "Lửa đang ấm, và luôn có chỗ ở bàn này cho bạn.",
                    "Không cần vội vàng. Ngồi một lúc, và để những lo lắng của bạn trôi đi như mây. 🍃"
                ],
                [
                    "Ồ, một khuôn mặt mới! Chào mừng, chào mừng! 🎭",
                    "Tôi đã giữ nơi này ấm áp, chờ đợi những người lữ khách như bạn.",
                    "Bạn đã đến được đây, và đó đã là một chiến thắng. Hãy cùng nhau ăn mừng những chiến thắng nhỏ nhé. 🎉"
                ],
                [
                    "Vào đi, vào đi! Cửa luôn mở. 🚪",
                    "Tôi biết thế giới bên ngoài có thể khắc nghiệt, nhưng ở đây? Ở đây bạn an toàn.",
                    "Hãy cởi bỏ những lo lắng như một chiếc áo choàng nặng. Bạn có thể nhặt chúng lên sau nếu cần. 🧥"
                ],
                [
                    "Rất vui được gặp lại bạn, bạn của Tôi! 🌸",
                    "Hoặc có lẽ đây là lần đầu tiên của bạn? Dù sao đi nữa, Tôi rất vui vì bạn ở đây.",
                    "Mọi hành trình đều bắt đầu từ đâu đó, và bạn đang thực hiện nó rồi. Tiếp tục cố gắng nhé. 💪"
                ],
                [
                    "Những ngôi sao đêm nay sáng rực nhỉ, người lữ khách? ⭐",
                    "Chúng nhắc nhở Tôi rằng ngay cả trong bóng tối, luôn có ánh sáng dẫn đường cho chúng ta.",
                    "Bạn mạnh mẽ hơn bạn biết. Hãy cùng nhau khám phá sức mạnh đó. ✨"
                ],
                [
                    "Chào mừng trở lại nơi trú ẩn của bạn! 🏰",
                    "Tôi đã nghĩ về bạn. Tự hỏi hành trình của bạn như thế nào.",
                    "Hãy nhớ, không sao nếu mọi thứ không ổn. Đó là lý do mà tôi xây dựng nên quán rượu này. 💙"
                ],
                [
                    "Ồ, bạn đây rồi! Tôi đã hy vọng bạn sẽ ghé thăm. 🎪",
                    "Cuộc sống có thể quá tải, phải không? Nhưng bạn không phải đối mặt một mình đâu.",
                    "Hãy cùng nhau giải quyết ngày hôm nay, từng bước nhẹ nhàng một. 🦋"
                ],
                [
                    "Hãy ngồi bên lò sưởi, người lữ khách. 🔥",
                    "Những ngọn lửa nhảy múa và kể những câu chuyện về sự kiên cường và hy vọng.",
                    "Câu chuyện của bạn cũng quan trọng. Hãy cùng nhau viết chương tiếp theo. 📖"
                ],
                [
                    "Ồ, xem ai đây! 👀",
                    "Tôi đã giữ một chỗ đặc biệt chỉ cho bạn. Không cần đặt chỗ.",
                    "Bạn xứng đáng được tử tế, đặc biệt là từ chính Tôi. Hãy nhớ điều đó. 💝"
                ],
                [
                    "Chào mừng từ chủ quán thân thiện của bạn! 🍻",
                    "Tôi nhận thấy bạn có thể đang mang theo một số suy nghĩ nặng nề hôm nay.",
                    "Điều đó hoàn toàn bình thường. Hãy đặt chúng xuống một lúc và hít thở. 🌊"
                ],
                [
                    "Xin chào, tâm hồn dũng cảm! 🛡️",
                    "Đến đây cần rất nhiều can đảm. Thừa nhận bạn cần sự hỗ trợ cũng rất dũng cảm.",
                    "Tôi tự hào về bạn vì đã chăm sóc bản thân. Điều đó không phải lúc nào cũng dễ dàng. 🌺"
                ],
                [
                    "Chào mừng đến nơi trú ẩn của bạn, người lữ khách thân yêu! 🕊️",
                    "Thế giới ngoài kia có thể đợi. Bây giờ, hãy dành khoảnh khắc này cho riêng bạn.",
                    "Hãy làm cho nó có ý nghĩa, cùng nhau. 🌿"
                ],
                [
                    "Chào bạn, bạn đã đến rồi! 🎊",
                    "Tôi biết một số ngày khó khăn hơn những ngày khác. Nhưng nhìn xem - bạn ở đây, và đó là điều gì đó.",
                    "Hãy chăm sóc bạn hôm nay. Bạn xứng đáng. 💐"
                ],
                [
                    "Chào mừng, bạn của Tôi! Tôi có nước ấm này. ☕",
                    "Có điều gì đó ấm áp về món chocolate ấm và một không gian an toàn, bạn có nghĩ vậy không?",
                    "Hãy dành thời gian thoải mái nhé. Không cần vội vàng đâu. 🍵"
                ],
                [
                    "Xin chào! 🌈",
                    "Bạn đã tìm đường đến quán rượu nhỏ này.",
                    "Đôi khi tất cả chúng ta đều cần một khoảnh khắc để chỉ... được là chính mình. 🌸"
                ],
                [
                    "Chào mừng, người lữ khách! 🗺️",
                    "Mọi hành trình đều có những thăng trầm. Hôm nay có thể là một trong những ngày đó.",
                    "Nhưng hãy nhớ - bão tố không kéo dài mãi mãi. Mặt trời sẽ lại chiếu rọi thôi. ☀️"
                ],
                [
                    "Chào mừng! Kéo ghế lại đây. 🪑",
                    "Tôi đã chờ bạn. Không vội vàng, chỉ... ở đây, sẵn sàng khi bạn cần Tôi.",
                    "Đó là những gì bạn bè làm, phải không? 💚"
                ],
                [
                    "Chào bạn! Rất vui được gặp bạn. 👋",
                    "Bạn biết không? Không sao nếu không có tất cả câu trả lời. Không sao nếu đôi khi cảm thấy lạc lõng.",
                    "Đó là lý do chúng ta ở đây - để cùng nhau tìm ra mọi thứ. 🤝"
                ],
                [
                    "Chào mừng trở lại, người thân yêu! 💜",
                    "Tôi hy vọng hôm nay đối xử tốt với bạn. Nếu không, chúng ta có thể cùng nhau vượt qua.",
                    "Bạn không bao giờ cô đơn đâu. Hãy nhớ điều đó. 🌟"
                ],
                [
                    "Xin chào, tâm hồn xinh đẹp! ✨",
                    "Tôi rất vui vì bạn đã dành thời gian cho chính mình hôm nay. Điều đó quan trọng.",
                    "Hãy làm cho khoảnh khắc này có ý nghĩa. Bạn làm được mà. 💪"
                ],
            ],
        },
        components: {
            gratitude: {
                title: "Nhật Ký Lòng Biết Ơn",
                description: "Hãy dành một chút thời gian để suy ngẫm về những gì bạn biết ơn hôm nay. Viết ra những điều bạn biết ơn có thể cải thiện tâm trạng của bạn. ✨",
                todayGratitudes: "Lòng Biết Ơn Hôm Nay",
                allEntries: "Tất Cả Mục Nhập",
                noEntries: "Chưa có mục nhập nào cho ngày này. Hãy bắt đầu thu thập những khoảnh khắc biết ơn! 🌟",
                dateLabel: "Chọn Ngày",
                entryLabel: "Bạn biết ơn điều gì?",
                addButton: "Thêm Lòng Biết Ơn",
            },
            schedule: {
                title: "Lịch Trình Hàng Ngày & Danh Sách Việc Cần Làm",
                description: "Lên kế hoạch cho ngày của bạn và theo dõi các nhiệm vụ. Hãy tổ chức và hoàn thành mục tiêu của bạn! 📋",
                selectDate: "Chọn Ngày",
                todoSection: "Danh Sách Việc Cần Làm",
                scheduleSection: "Lịch Trình Hàng Ngày",
                addTodo: "Thêm Việc Cần Làm",
                addSchedule: "Thêm Mục Lịch Trình",
                noTodos: "Không có việc cần làm nào cho ngày này. Thêm một việc để bắt đầu! ✅",
                noSchedule: "Không có mục lịch trình nào cho ngày này. Hãy lên kế hoạch cho ngày của bạn! ⏰",
            },
            coping: {
                title: "Chiến Lược Đối Phó Với Tiêu Cực",
                description: "Khi bạn cảm thấy quá tải, lo lắng hoặc căng thẳng, hãy thử những cách này. Tìm ra điều gì phù hợp nhất với bạn! 💚",
                allCategories: "Tất Cả Danh Mục",
                noStrategies: "Không tìm thấy chiến lược nào trong danh mục này. Hãy thử danh mục khác! 🌟",
            },
            thoughts: {
                title: "Nhật Ký Suy Nghĩ",
                description: "Ghi lại suy nghĩ và cảm xúc của bạn. Điều này giúp bạn nhận thức rõ hơn về các mẫu và yếu tố kích hoạt trong suy nghĩ của bạn. 📖",
                dateLabel: "Chọn Ngày",
                thoughtLabel: "Suy Nghĩ",
                emotionLabel: "Cảm Xúc",
                intensityLabel: "Cường Độ (1-10)",
                evidenceLabel: "Bằng Chứng (Tùy Chọn)",
                addButton: "Thêm Mục Suy Nghĩ",
                noEntries: "Chưa có mục nhập nào cho ngày này. Hãy bắt đầu ghi lại suy nghĩ của bạn! 💭",
                allEntries: "Tất Cả Mục Nhập",
                entriesFor: "Mục nhập cho",
            },
            music: {
                title: "Bài Hát Ngẫu Nhiên 🎵",
                description: "Khám phá một bài hát ngẫu nhiên từ danh sách phát được tuyển chọn của chúng tôi để giúp bạn thư giãn, tập trung hoặc cải thiện tâm trạng. 🎶",
                anotherSong: "Bài Hát Khác",
            },
            export: {
                title: "Xuất Ra Hình Ảnh",
                description: "Tạo một bức ảnh đẹp về hành trình sức khỏe của bạn! Tải lên một bức ảnh selfie và kết hợp nó với danh sách việc cần làm và nhật ký suy nghĩ của bạn thành một hình ảnh duy nhất. 📸",
                uploadSelfie: "Tải Lên Ảnh Selfie",
                generateButton: "Tạo Hình Ảnh",
                downloadButton: "Tải Xuống Hình Ảnh",
            },
        },
    },
}

export function useLanguage() {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language')
        if (saved && (saved === 'en' || saved === 'vi')) {
            return saved as Language
        }
        // Detect browser language
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('vi')) {
            return 'vi'
        }
        return 'en'
    })

    useEffect(() => {
        localStorage.setItem('language', language)
        // Update HTML lang attribute
        document.documentElement.lang = language
    }, [language])

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'vi' : 'en')
    }

    const t = translations[language]

    return { language, toggleLanguage, t }
}

